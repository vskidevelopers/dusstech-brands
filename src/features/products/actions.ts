"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { productSchema, type ProductFormData } from "./schema";
import { isProductSlugTaken } from "./queries";
import type { Product, ProductActionResult } from "./types";
import type { Tables } from "@/types/database";

type ProductUpdate = Partial<Tables<"products">>;

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "A product with this slug already exists.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect to the database. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Sync the product_collections junction table.
 */
async function syncProductCollections(
  productId: string,
  collectionIds: string[],
) {
  const supabase = await createClient();

  await supabase
    .from("product_collections")
    .delete()
    .eq("product_id", productId);

  if (collectionIds.length > 0) {
    await supabase.from("product_collections").insert(
      collectionIds.map((collectionId) => ({
        product_id: productId,
        collection_id: collectionId,
      })),
    );
  }
}

async function toggleBooleanField(
  id: string,
  field: "featured" | "active" | "new_arrival" | "popular",
  value: boolean,
): Promise<ProductActionResult> {
  await requireAuth();

  const supabase = await createClient();

  const updateData: ProductUpdate = (() => {
    switch (field) {
      case "featured":
        return { featured: value };
      case "active":
        return { active: value };
      case "new_arrival":
        return { new_arrival: value };
      case "popular":
        return { popular: value };
    }
  })();

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/products");
  return { success: true };
}

export async function createProductAction(
  formData: ProductFormData,
): Promise<ProductActionResult<Product>> {
  await requireAuth();

  const validation = productSchema.safeParse(formData);
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
  const { collection_ids, ...productData } = data;

  if (await isProductSlugTaken(data.slug)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: productData.name,
      slug: productData.slug,
      short_description: productData.short_description,
      description: productData.description,
      category_id: productData.category_id,
      selling_price: productData.selling_price,
      compare_at_price: productData.compare_at_price,
      branding_included: productData.branding_included,
      branding_notes: productData.branding_notes,
      material: productData.material,
      color: productData.color,
      size: productData.size,
      capacity: productData.capacity,
      minimum_order_quantity: productData.minimum_order_quantity,
      lead_time: productData.lead_time,
      featured_image: productData.featured_image,
      gallery: productData.gallery,
      featured: productData.featured,
      new_arrival: productData.new_arrival,
      popular: productData.popular,
      whatsapp_message: productData.whatsapp_message,
      seo_title: productData.seo_title,
      seo_description: productData.seo_description,
      active: productData.active,
    })
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  await syncProductCollections(product.id, collection_ids);

  revalidatePath("/admin/products");
  return { success: true, data: product };
}

export async function updateProductAction(
  id: string,
  formData: ProductFormData,
): Promise<ProductActionResult<Product>> {
  await requireAuth();

  const validation = productSchema.safeParse(formData);
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
  const { collection_ids, ...productData } = data;

  if (await isProductSlugTaken(data.slug, id)) {
    return {
      success: false,
      fieldErrors: {
        slug: "This slug is already in use. Please choose another.",
      },
    };
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      slug: productData.slug,
      short_description: productData.short_description,
      description: productData.description,
      category_id: productData.category_id,
      selling_price: productData.selling_price,
      compare_at_price: productData.compare_at_price,
      branding_included: productData.branding_included,
      branding_notes: productData.branding_notes,
      material: productData.material,
      color: productData.color,
      size: productData.size,
      capacity: productData.capacity,
      minimum_order_quantity: productData.minimum_order_quantity,
      lead_time: productData.lead_time,
      featured_image: productData.featured_image,
      gallery: productData.gallery,
      featured: productData.featured,
      new_arrival: productData.new_arrival,
      popular: productData.popular,
      whatsapp_message: productData.whatsapp_message,
      seo_title: productData.seo_title,
      seo_description: productData.seo_description,
      active: productData.active,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  await syncProductCollections(id, collection_ids);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  return { success: true, data: product };
}

export async function deleteProductAction(
  id: string,
): Promise<ProductActionResult> {
  await requireAuth();

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ active: false })
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleFeaturedAction(id: string, value: boolean) {
  return toggleBooleanField(id, "featured", value);
}

export async function toggleActiveAction(id: string, value: boolean) {
  return toggleBooleanField(id, "active", value);
}

export async function toggleNewArrivalAction(id: string, value: boolean) {
  return toggleBooleanField(id, "new_arrival", value);
}

export async function togglePopularAction(id: string, value: boolean) {
  return toggleBooleanField(id, "popular", value);
}
