import type { Tables } from "@/types/database";

export type Category = Tables<"categories">;
export type CategoryInsert = Tables<"categories">;
export type CategoryUpdate = Tables<"categories">;

export type CategoryStatus = "active" | "inactive";

export interface CategoryFilters {
  search?: string;
  status?: CategoryStatus | "all";
  featured?: boolean | "all";
  sortBy?: "created_at" | "updated_at" | "name" | "sort_order";
  sortOrder?: "asc" | "desc";
}

export interface CategoryActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
