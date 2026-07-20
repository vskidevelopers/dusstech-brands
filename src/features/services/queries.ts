"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import type { Service, ServiceFilters } from "./types";

/**
 * Fetch services with filters, search, and sorting.
 * Public-ish (still requires auth for admin panel).
 */
export async function getServices(
  filters: ServiceFilters = {},
): Promise<Service[]> {
  await requireAuth();

  const supabase = await createClient();
  const {
    search,
    status = "all",
    featured = "all",
    sortBy = "created_at",
    sortOrder = "desc",
  } = filters;

  let query = supabase.from("services").select("*");

  // Status filter (soft delete aware)
  if (status === "active") query = query.eq("active", true);
  else if (status === "inactive") query = query.eq("active", false);

  // Featured filter
  if (featured === true) query = query.eq("featured", true);
  else if (featured === false) query = query.eq("featured", false);

  // Search
  if (search && search.trim().length > 0) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  // Sort
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("[getServices]", error);
    return [];
  }

  return data ?? [];
}

/**
 * Fetch a single service by ID.
 */
export async function getServiceById(id: string): Promise<Service | null> {
  await requireAuth();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Check if a slug already exists (optionally excluding a specific ID for edits).
 */
export async function isSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("services").select("id").eq("slug", slug).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}

/**
 * Get the collection IDs associated with a service.
 */
export async function getServiceCollectionIds(
  serviceId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_collections")
    .select("collection_id")
    .eq("service_id", serviceId);

  if (error) return [];
  // Cast data to the expected shape to satisfy TypeScript
  return (
    (data as { collection_id: string }[])?.map((row) => row.collection_id) ?? []
  );
}

export async function getActiveServicesForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, starting_price")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) return [];
  return (data || []) as {
    id: string;
    name: string;
    starting_price: number | null;
  }[];
}
