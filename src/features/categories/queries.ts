"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import type { Category, CategoryFilters } from "./types";

export async function getCategories(
  filters: CategoryFilters = {},
): Promise<Category[]> {
  await requireAuth();

  const supabase = await createClient();
  const {
    search,
    status = "all",
    featured = "all",
    sortBy = "sort_order",
    sortOrder = "asc",
  } = filters;

  let query = supabase.from("categories").select("*");

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
    console.error("[getCategories]", error);
    return [];
  }

  return data ?? [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await requireAuth();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getAllCategoriesForSelect(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function isCategorySlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) query = query.neq("id", excludeId);

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}
