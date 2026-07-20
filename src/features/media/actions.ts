"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { v2 as cloudinary } from "cloudinary";
import type {
  MediaFilters,
  MediaPaginatedResult,
  CloudinaryUploadResult,
  UploadSignature,
} from "./types";

// Configure Cloudinary with env vars
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ROOT_FOLDER = "dusstech-brands";

/**
 * Generates a secure signature for direct client-to-Cloudinary upload.
 */
export async function generateUploadSignatureAction(
  folder: string,
  publicId?: string,
): Promise<UploadSignature & { folder: string }> {
  // <-- Added & { folder: string }
  await requireAuth();

  const timestamp = Math.round(new Date().getTime() / 1000);

  // 1. Define the exact folder being signed
  const finalFolder = `${ROOT_FOLDER}/${folder}`;

  const paramsToSign = {
    timestamp,
    folder: finalFolder, // <-- Sign this exact string
    ...(publicId && { public_id: publicId }),
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder: finalFolder,
  };
}

/**
 * Saves Cloudinary metadata to Supabase after a successful direct upload.
 */
export async function saveMediaMetadataAction(
  result: CloudinaryUploadResult,
  folder: string,
  altText?: string,
  tags?: string[],
) {
  await requireAuth();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("media")
    .insert({
      public_id: result.public_id,
      secure_url: result.secure_url,
      folder,
      filename: result.public_id.split("/").pop() || result.original_filename,
      original_filename: result.original_filename,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
      alt_text: altText || null,
      tags: tags || [],
      uploaded_by: user?.id || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deletes media from both Cloudinary and Supabase.
 */
export async function deleteMediaAction(publicId: string) {
  await requireAuth();
  const supabase = await createClient();

  // 1. Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId);

  // 2. Delete from Supabase
  const { error } = await supabase
    .from("media")
    .delete()
    .eq("public_id", publicId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
  return { success: true };
}

/**
 * Fetches media with pagination, search, and filters.
 */
export async function getMediaListAction(
  filters: MediaFilters = {},
): Promise<MediaPaginatedResult> {
  await requireAuth();
  const supabase = await createClient();

  const {
    search,
    folder,
    resourceType = "image",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    pageSize = 24,
  } = filters;

  let query = supabase.from("media").select("*", { count: "exact" });

  if (folder) query = query.eq("folder", folder);
  if (resourceType !== "auto") query = query.eq("resource_type", resourceType);

  if (search) {
    query = query.or(
      `filename.ilike.%${search}%,original_filename.ilike.%${search}%,alt_text.ilike.%${search}%`,
    );
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
  };
}
