/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  price: number;
  compare_at_price: number | null;
  selling_price: number | null;
  stock: number;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  featured: boolean;
  popular: boolean;
  new_arrival: boolean;
  featured_image: string | null;
  gallery: string[] | null;
  specifications: Record<string, string> | null;
  branding_notes: string | null;
  whatsapp_message: string | null;
  seo_title: string | null;
  seo_description: string | null;
  collection_ids: string[] | null;
  created_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  collection?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "featured" | "popular";
  featured?: boolean;
  new_arrival?: boolean;
  popular?: boolean;
  price_min?: number;
  price_max?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  data: PublicProduct[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPublicProducts(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  const supabase = await createClient();
  const {
    search,
    category,
    collection,
    sort = "newest",
    featured,
    new_arrival,
    popular,
    price_min,
    price_max,
    page = 1,
    pageSize = 16,
  } = filters;

  let query = supabase
    .from("products")
    .select("*, categories(name)", { count: "exact" })
    .eq("active", true);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,short_description.ilike.%${search}%`,
    );
  }

  if (category) {
    query = query.eq("category_id", category);
  }

  if (collection) {
    query = query.contains("collection_ids", [collection]);
  }

  if (featured !== undefined) {
    query = query.eq("featured", featured);
  }

  if (new_arrival !== undefined) {
    query = query.eq("new_arrival", new_arrival);
  }

  if (popular !== undefined) {
    query = query.eq("popular", popular);
  }

  if (price_min !== undefined) {
    query = query.gte("price", price_min);
  }

  if (price_max !== undefined) {
    query = query.lte("price", price_max);
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "featured":
      query = query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      break;
    case "popular":
      query = query
        .order("popular", { ascending: false })
        .order("created_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getPublicProducts]", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const mapped: PublicProduct[] = (data || []).map(mapProductRow);

  return {
    data: mapped,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
  };
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<PublicProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;

  return mapProductRow(data);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  collectionIds: string[] | null,
  limit = 4,
): Promise<PublicProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, categories(name)")
    .eq("active", true)
    .neq("id", productId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  if ((!data || data.length === 0) && collectionIds?.length) {
    const { data: collectionData } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("active", true)
      .neq("id", productId)
      .overlaps("collection_ids", collectionIds)
      .limit(limit);

    return (collectionData || []).map(mapProductRow);
  }

  return (data || []).map(mapProductRow);
}

export async function getProductFilterOptions() {
  const supabase = await createClient();

  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("collections")
      .select("id, name")
      .eq("active", true)
      .order("name"),
  ]);

  return {
    categories: categories || [],
    collections: collections || [],
  };
}

function mapProductRow(row: any): PublicProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    category_id: row.category_id,
    category_name: row.categories?.name || null,
    price: row.selling_price ?? row.price ?? 0,
    compare_at_price: row.compare_at_price,
    selling_price: row.selling_price,
    stock: row.stock,
    availability: row.availability,
    featured: row.featured,
    popular: row.popular,
    new_arrival: row.new_arrival,
    featured_image: row.featured_image,
    gallery: row.gallery,
    specifications: row.specifications,
    branding_notes: row.branding_notes,
    whatsapp_message: row.whatsapp_message,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    collection_ids: row.collection_ids,
    created_at: row.created_at,
  };
}
