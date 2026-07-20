import type { ProductFilters } from "@/features/products/types";
import type { ServiceFilters } from "@/features/services/types";
import type { CollectionFilters } from "@/features/collections/types";
import type { CategoryFilters } from "@/features/categories/types";

export const queryKeys = {
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters: ServiceFilters) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: ProductFilters) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters: CategoryFilters) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  collections: {
    all: ["collections"] as const,
    lists: () => [...queryKeys.collections.all, "list"] as const,
    list: (filters: CollectionFilters) =>
      [...queryKeys.collections.lists(), filters] as const,
    details: () => [...queryKeys.collections.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.collections.details(), id] as const,
  },
};
