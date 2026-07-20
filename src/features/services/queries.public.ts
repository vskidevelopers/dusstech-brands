/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";

export interface PublicService {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  starting_price: number | null;
  pricing_type: "fixed" | "starting_from" | "custom_quote";
  featured: boolean;
  featured_image: string | null;
  gallery: string[] | null;
  turnaround_time: string | null;
  whatsapp_message: string | null;
  branding_notes: string | null;
  seo_title: string | null;
  seo_description: string | null;
  collection_ids: string[] | null;
  created_at: string;
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  collection?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "featured";
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedServices {
  data: PublicService[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPublicServices(
  filters: ServiceFilters = {},
): Promise<PaginatedServices> {
  const supabase = await createClient();
  const {
    search,
    category,
    collection,
    sort = "newest",
    featured,
    page = 1,
    pageSize = 12,
  } = filters;

  let query = supabase
    .from("services")
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

  switch (sort) {
    case "price_asc":
      query = query.order("starting_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("starting_price", { ascending: false });
      break;
    case "featured":
      query = query
        .order("featured", { ascending: false })
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
    console.error("[getPublicServices]", error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const mapped: PublicService[] = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    category_id: row.category_id,
    category_name: row.categories?.name || null,
    starting_price: row.starting_price,
    pricing_type: row.pricing_type,
    featured: row.featured,
    featured_image: row.featured_image,
    gallery: row.gallery,
    turnaround_time: row.turnaround_time,
    whatsapp_message: row.whatsapp_message,
    branding_notes: row.branding_notes,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    collection_ids: row.collection_ids,
    created_at: row.created_at,
  }));

  return {
    data: mapped,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
  };
}

export async function getPublicServiceBySlug(
  slug: string,
): Promise<PublicService | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    short_description: data.short_description,
    description: data.description,
    category_id: data.category_id,
    category_name: (data as any).categories?.name || null,
    starting_price: data.starting_price,
    pricing_type: data.pricing_type as
      | "fixed"
      | "starting_from"
      | "custom_quote",
    featured: data.featured,
    featured_image: data.featured_image,
    gallery: data.gallery,
    turnaround_time: data.turnaround_time,
    whatsapp_message: data.whatsapp_message,
    branding_notes: (data as any).branding_notes || null,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    collection_ids: (data as any).collection_ids || null,
    created_at: data.created_at,
  };
}

export async function getRelatedServices(
  serviceId: string,
  categoryId: string | null,
  collectionIds: string[] | null,
  limit = 4,
): Promise<PublicService[]> {
  const supabase = await createClient();

  let query = supabase
    .from("services")
    .select("*, categories(name)")
    .eq("active", true)
    .neq("id", serviceId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data || (data.length === 0 && collectionIds?.length)) {
    const { data: collectionData } = await supabase
      .from("services")
      .select("*, categories(name)")
      .eq("active", true)
      .neq("id", serviceId)
      // collectionIds may be null; ensure a non-null array for the overlaps call
      .overlaps("collection_ids", collectionIds ?? ([] as string[]))
      .limit(limit);

    return (collectionData || []).map(mapServiceRow);
  }

  return (data || []).map(mapServiceRow);
}

function mapServiceRow(row: any): PublicService {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    category_id: row.category_id,
    category_name: row.categories?.name || null,
    starting_price: row.starting_price,
    pricing_type: row.pricing_type,
    featured: row.featured,
    featured_image: row.featured_image,
    gallery: row.gallery,
    turnaround_time: row.turnaround_time,
    whatsapp_message: row.whatsapp_message,
    branding_notes: row.branding_notes,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    collection_ids: row.collection_ids,
    created_at: row.created_at,
  };
}

export async function getServiceFilterOptions() {
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
