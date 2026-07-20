import type { Tables } from "@/types/database";

export type Service = Tables<"services">["Row"];
export type ServiceInsert = Tables<"services">["Insert"];
export type ServiceUpdate = Tables<"services">["Update"];

export type PricingType = "fixed" | "starting_from" | "custom_quote";
export type ServiceStatus = "active" | "inactive";

export interface ServiceFilters {
  search?: string;
  status?: ServiceStatus | "all";
  featured?: boolean | "all";
  sortBy?: "created_at" | "updated_at" | "name" | "starting_price";
  sortOrder?: "asc" | "desc";
}

export interface ServiceActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
