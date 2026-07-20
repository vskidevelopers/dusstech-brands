"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { categorySchema, type CategoryFormData } from "./schema";
import { isCategorySlugTaken } from "./queries";
import type { Category, CategoryActionResult } from "./types";
import type { Tables } from "@/types/database";

type CategoryUpdate = Partial<Tables<"categories">>;

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "A category with this slug already exists.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect to the database. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

async function toggleBooleanField(
  id: string,
  field: "featured" | "active",
  value: boolean,
): Promise<CategoryActionResult> {
  await requireAuth();

  const supabase = await createClient();

  const updateData: CategoryUpdate = (() => {
    switch (field) {
      case "featured":
        return { featured: value };
      case "active":
        return { active: value };
    }
  })();

  const { error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function createCategoryAction(
  formData: CategoryFormData,
): Promise<CategoryActionResult<Category>> {
  await requireAuth();

  const validation = categorySchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: validation.error.flatten().fieldErrors as Record<
        string,
        string
      >,
    };
  }

  const data = validation.data;

  if (await isCategorySlugTaken(data.slug)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      sort_order: data.sort_order,
      featured: data.featured,
      active: data.active,
    })
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/categories");
  return { success: true, data: category };
}

export async function updateCategoryAction(
  id: string,
  formData: CategoryFormData,
): Promise<CategoryActionResult<Category>> {
  await requireAuth();

  const validation = categorySchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: validation.error.flatten().fieldErrors as Record<
        string,
        string
      >,
    };
  }

  const data = validation.data;

  if (await isCategorySlugTaken(data.slug, id)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      sort_order: data.sort_order,
      featured: data.featured,
      active: data.active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  return { success: true, data: category };
}

export async function deleteCategoryAction(
  id: string,
): Promise<CategoryActionResult> {
  await requireAuth();

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ active: false })
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function toggleFeaturedAction(id: string, value: boolean) {
  return toggleBooleanField(id, "featured", value);
}

export async function toggleActiveAction(id: string, value: boolean) {
  return toggleBooleanField(id, "active", value);
}
