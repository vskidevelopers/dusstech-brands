import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  generateUploadSignatureAction,
  saveMediaMetadataAction,
  deleteMediaAction,
} from "./actions";
import type { CloudinaryUploadResult } from "./types";

export function useUploadMedia(folder: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const upload = async (file: File, altText?: string, tags?: string[]) => {
    console.log(
      "🔥 STEP 1: Upload started for file:",
      file.name,
      "in folder:",
      folder,
    );
    setIsUploading(true);
    setProgress(0);

    try {
      console.log("🔥 STEP 2: Requesting signature from server...");
      const signatureData = await generateUploadSignatureAction(folder);
      console.log(
        "✅ STEP 2 COMPLETE: Signature received. Folder to be used:",
        signatureData.folder,
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;
      console.log("🔥 STEP 3: Sending to Cloudinary...");

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "❌ STEP 3 FAILED: Cloudinary rejected the upload",
          errorData,
        );
        throw new Error(
          errorData?.error?.message || "Unknown Cloudinary error",
        );
      }

      const result: CloudinaryUploadResult = await response.json();
      console.log(
        "✅ STEP 3 COMPLETE: Cloudinary upload successful. Public ID:",
        result.public_id,
      );

      console.log("🔥 STEP 4: Saving metadata to Supabase...");
      const savedMedia = await saveMediaMetadataAction(
        result,
        folder,
        altText,
        tags,
      );
      console.log(
        "✅ STEP 4 COMPLETE: Supabase saved media with ID:",
        savedMedia.id,
        "URL:",
        savedMedia.secure_url,
      );

      console.log("🔥 STEP 5: Invalidating React Query cache for ['media']...");
      queryClient.invalidateQueries({ queryKey: ["media"] });
      console.log(
        "✅ STEP 5 COMPLETE: Cache invalidated. MediaLibrary should refetch now.",
      );

      toast.success("Media uploaded successfully");
      return savedMedia;
    } catch (error) {
      console.error("❌ UPLOAD PROCESS FAILED:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload media",
      );
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  return { upload, isUploading, progress };
}
// ... (keep useDeleteMedia as is, but you can also add queryClient.invalidateQueries there too!)
export function useDeleteMedia() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMedia = async (publicId: string) => {
    setIsDeleting(true);
    try {
      await deleteMediaAction(publicId);
      toast.success("Media deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete media");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteMedia, isDeleting };
}
