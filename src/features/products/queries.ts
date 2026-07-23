"use server";

import { createClient } from "@/lib/supabase/server";

import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Product, ProductFilters, ProductPaginatedResult } from "./types";
import { getOptionalUser } from "@/lib/supabase/requireAuth";

/**
 * Fetch products with filters, search, sorting, and pagination.
 */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductPaginatedResult> {
  await getOptionalUser();

  const supabase = await createClient();
  const {
    search,
    status = "all",
    featured = "all",
    newArrival = "all",
    popular = "all",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;

  // Build base query
  let query = supabase.from("products").select("*", { count: "exact" });

  if (status === "active") query = query.eq("active", true);
  else if (status === "inactive") query = query.eq("active", false);

  if (featured === true) query = query.eq("featured", true);
  else if (featured === false) query = query.eq("featured", false);

  if (newArrival === true) query = query.eq("new_arrival", true);
  else if (newArrival === false) query = query.eq("new_arrival", false);

  if (popular === true) query = query.eq("popular", true);
  else if (popular === false) query = query.eq("popular", false);

  if (search && search.trim().length > 0) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Pagination
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getProducts]", error);
    return {
      data: [],
      count: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 0,
    };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

  return {
    data: data ?? [],
    count: totalCount,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  await getOptionalUser();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Check if a slug already exists (optionally excluding a specific ID for edits).
 */
export async function isProductSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("products").select("id").eq("slug", slug).limit(1);

  if (excludeId) query = query.neq("id", excludeId);

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}

/**
 * Get the collection IDs associated with a product.
 */
export async function getProductCollectionIds(
  productId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_collections")
    .select("collection_id")
    .eq("product_id", productId);

  if (error) return [];

  // Supabase returns unknown typed rows; cast to expected shape to satisfy TS
  const rows = data as { collection_id: string }[] | null;
  return rows?.map((row) => row.collection_id) ?? [];
}

export async function getActiveProductsForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, selling_price")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) return [];
  return (data || []) as { id: string; name: string; selling_price: number }[];
}

export async function getFeaturedProducts(
  limit: number = 8,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or("featured.eq.true,popular.eq.true,new_arrival.eq.true")
    .eq("active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
  return (data as Product[]) ?? [];
}
