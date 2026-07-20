import type { Tables } from "@/types/database";

export type Quotation = Tables<"quotations">;
export type QuotationItem = Tables<"quotation_items">;
export type QuotationStatus =
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  | "expired"
  | "converted";
export type ItemType = "service" | "product" | "custom";

export interface QuotationWithItems extends Quotation {
  items: QuotationItem[];
}

export interface QuotationFilters {
  search?: string;
  status?: QuotationStatus | "all";
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface QuotationPaginatedResult {
  data: Quotation[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QuotationActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
