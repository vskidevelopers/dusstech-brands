"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { collectionSchema, type CollectionFormData } from "./schema";
import { isCollectionSlugTaken } from "./queries";
import type { Collection, CollectionActionResult } from "./types";
import type { Tables } from "@/types/database";

type CollectionUpdate = Partial<Tables<"collections">>;

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "A collection with this slug already exists.";
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
): Promise<CollectionActionResult> {
  await requireAuth();

  const supabase = await createClient();

  const updateData: CollectionUpdate = (() => {
    switch (field) {
      case "featured":
        return { featured: value };
      case "active":
        return { active: value };
    }
  })();

  const { error } = await supabase
    .from("collections")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/collections");
  return { success: true };
}

export async function createCollectionAction(
  formData: CollectionFormData,
): Promise<CollectionActionResult<Collection>> {
  await requireAuth();

  const validation = collectionSchema.safeParse(formData);
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

  if (await isCollectionSlugTaken(data.slug)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: collection, error } = await supabase
    .from("collections")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      featured: data.featured,
      active: data.active,
    })
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/collections");
  return { success: true, data: collection };
}

export async function updateCollectionAction(
  id: string,
  formData: CollectionFormData,
): Promise<CollectionActionResult<Collection>> {
  await requireAuth();

  const validation = collectionSchema.safeParse(formData);
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

  if (await isCollectionSlugTaken(data.slug, id)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: collection, error } = await supabase
    .from("collections")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      featured: data.featured,
      active: data.active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${id}/edit`);
  return { success: true, data: collection };
}

export async function deleteCollectionAction(
  id: string,
): Promise<CollectionActionResult> {
  await requireAuth();

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({ active: false })
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/collections");
  return { success: true };
}

export async function toggleFeaturedAction(id: string, value: boolean) {
  return toggleBooleanField(id, "featured", value);
}

export async function toggleActiveAction(id: string, value: boolean) {
  return toggleBooleanField(id, "active", value);
}
