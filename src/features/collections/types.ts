import type { Tables } from "@/types/database";

export type Collection = Tables<"collections">["Row"];
export type CollectionInsert = Tables<"collections">["Insert"];
export type CollectionUpdate = Tables<"collections">["Update"];

export type CollectionStatus = "active" | "inactive";

export interface CollectionFilters {
  search?: string;
  status?: CollectionStatus | "all";
  featured?: boolean | "all";
  sortBy?: "created_at" | "updated_at" | "name";
  sortOrder?: "asc" | "desc";
}

export interface CollectionActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
