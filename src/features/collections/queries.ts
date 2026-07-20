"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import type { Collection, CollectionFilters } from "./types";

export async function getCollections(
  filters: CollectionFilters = {},
): Promise<Collection[]> {
  await requireAuth();

  const supabase = await createClient();
  const {
    search,
    status = "all",
    featured = "all",
    sortBy = "created_at",
    sortOrder = "desc",
  } = filters;

  let query = supabase.from("collections").select("*");

  if (status === "active") query = query.eq("active", true);
  else if (status === "inactive") query = query.eq("active", false);

  if (featured === true) query = query.eq("featured", true);
  else if (featured === false) query = query.eq("featured", false);

  if (search && search.trim().length > 0) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("[getCollections]", error);
    return [];
  }

  return data ?? [];
}

export async function getCollectionById(
  id: string,
): Promise<Collection | null> {
  await requireAuth();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getAllCollectionsForSelect(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function isCollectionSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from("collections")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) query = query.neq("id", excludeId);

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}
