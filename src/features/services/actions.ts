"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { serviceSchema, type ServiceFormData } from "./schema";
import { isSlugTaken } from "./queries";
import type { Service, ServiceActionResult } from "./types";
import type { Tables } from "@/types/database";

type ServiceUpdate = Partial<Tables<"services">>;

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "A service with this slug already exists.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect to the database. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Sync the service_collections junction table.
 * Deletes existing entries and inserts new ones.
 */
async function syncServiceCollections(
  serviceId: string,
  collectionIds: string[],
) {
  const supabase = await createClient();

  // Delete existing associations
  await supabase
    .from("service_collections")
    .delete()
    .eq("service_id", serviceId);

  // Insert new associations
  if (collectionIds.length > 0) {
    await supabase.from("service_collections").insert(
      collectionIds.map((collectionId) => ({
        service_id: serviceId,
        collection_id: collectionId,
      })),
    );
  }
}

export async function createServiceAction(
  formData: ServiceFormData,
): Promise<ServiceActionResult<Service>> {
  await requireAuth();

  const validation = serviceSchema.safeParse(formData);
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
  const { collection_ids, ...serviceData } = data;

  if (await isSlugTaken(data.slug)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .insert({
      name: serviceData.name,
      slug: serviceData.slug,
      short_description: serviceData.short_description,
      description: serviceData.description,
      category_id: serviceData.category_id,
      starting_price: serviceData.starting_price,
      pricing_type: serviceData.pricing_type,
      featured: serviceData.featured,
      active: serviceData.active,
      featured_image: serviceData.featured_image,
      gallery: serviceData.gallery,
      turnaround_time: serviceData.turnaround_time,
      whatsapp_message: serviceData.whatsapp_message,
      seo_title: serviceData.seo_title,
      seo_description: serviceData.seo_description,
    })
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  // Sync collections junction table
  await syncServiceCollections(service.id, collection_ids);

  revalidatePath("/admin/services");
  return { success: true, data: service };
}

export async function updateServiceAction(
  id: string,
  formData: ServiceFormData,
): Promise<ServiceActionResult<Service>> {
  await requireAuth();

  const validation = serviceSchema.safeParse(formData);
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
  const { collection_ids, ...serviceData } = data;

  if (await isSlugTaken(data.slug, id)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .update({
      name: serviceData.name,
      slug: serviceData.slug,
      short_description: serviceData.short_description,
      description: serviceData.description,
      category_id: serviceData.category_id,
      starting_price: serviceData.starting_price,
      pricing_type: serviceData.pricing_type,
      featured: serviceData.featured,
      active: serviceData.active,
      featured_image: serviceData.featured_image,
      gallery: serviceData.gallery,
      turnaround_time: serviceData.turnaround_time,
      whatsapp_message: serviceData.whatsapp_message,
      seo_title: serviceData.seo_title,
      seo_description: serviceData.seo_description,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  // Sync collections junction table
  await syncServiceCollections(id, collection_ids);

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);
  return { success: true, data: service };
}

export async function deleteServiceAction(
  id: string,
): Promise<ServiceActionResult> {
  await requireAuth();

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ active: false })
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/services");
  return { success: true };
}

async function toggleBooleanField(
  id: string,
  field: "featured" | "active",
  value: boolean,
): Promise<ServiceActionResult> {
  await requireAuth();

  const supabase = await createClient();

  const updateData: ServiceUpdate = (() => {
    switch (field) {
      case "featured":
        return { featured: value };
      case "active":
        return { active: value };
    }
  })();

  const { error } = await supabase
    .from("services")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleFeaturedAction(id: string, value: boolean) {
  return toggleBooleanField(id, "featured", value);
}

export async function toggleActiveAction(id: string, value: boolean) {
  return toggleBooleanField(id, "active", value);
}
