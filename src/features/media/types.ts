import type { Tables } from "@/types/database";

export type MediaItem = Tables<"media">;

export interface MediaFilters {
  search?: string;
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  sortBy?: "created_at" | "bytes" | "width";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface MediaPaginatedResult {
  data: MediaItem[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  resource_type: string;
  original_filename: string;
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}
