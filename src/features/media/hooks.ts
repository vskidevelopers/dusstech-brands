import { useState } from "react";
import { toast } from "sonner";
import {
  generateUploadSignatureAction,
  saveMediaMetadataAction,
  deleteMediaAction,
} from "./actions";
import type { CloudinaryUploadResult } from "./types";

export function useUploadMedia(folder: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, altText?: string, tags?: string[]) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Get secure signature from server
      const signatureData = await generateUploadSignatureAction(folder);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", signatureData.timestamp.toString());
      formData.append("signature", signatureData.signature);
      formData.append(
        "folder",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${folder}`,
      ); // Cloudinary expects full path or just folder depending on config, let's use the signed folder

      // 2. Upload directly to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Note: Progress events require XMLHttpRequest or a custom fetch wrapper.
        // For simplicity in Next.js, we'll simulate or use a basic fetch.
        // For true progress, see note below.
      });

      if (!response.ok) throw new Error("Cloudinary upload failed");

      const result: CloudinaryUploadResult = await response.json();

      // 3. Save metadata to Supabase
      const savedMedia = await saveMediaMetadataAction(
        result,
        folder,
        altText,
        tags,
      );

      toast.success("Media uploaded successfully");
      return savedMedia;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload media");
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  return { upload, isUploading, progress };
}

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
