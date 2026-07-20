import type { Tables } from "@/types/database";

export type Product = Tables<"products">["Row"];
export type ProductInsert = Tables<"products">["Insert"];
export type ProductUpdate = Tables<"products">["Update"];

export type ProductStatus = "active" | "inactive";

export interface ProductFilters {
  search?: string;
  status?: ProductStatus | "all";
  featured?: boolean | "all";
  newArrival?: boolean | "all";
  popular?: boolean | "all";
  sortBy?: "created_at" | "updated_at" | "name" | "selling_price";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ProductPaginatedResult {
  data: Product[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
