import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { ProductFilters } from "./types";

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  search: "",
  status: "all",
  featured: "all",
  newArrival: "all",
  popular: "all",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const PRODUCT_CATEGORIES = [
  "Apparel",
  "Drinkware",
  "Office",
  "Tech Accessories",
  "Corporate Gifts",
  "Signage",
  "Other",
] as const;
