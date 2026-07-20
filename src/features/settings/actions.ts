"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { settingsSchema, type SettingsFormData } from "./schema";
import type { SettingsActionResult } from "./types";

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect to the database. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

function toUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

/**
 * Update the singleton settings row.
 * Uses UPSERT on the singleton_key to guarantee exactly one row.
 */
export async function updateSettingsAction(
  formData: SettingsFormData,
): Promise<SettingsActionResult> {
  await requireAuth();

  const validation = settingsSchema.safeParse(formData);
  if (!validation.success) {
    const fieldErrors = validation.error.issues.reduce<Record<string, string>>(
      (acc, issue) => {
        const path = issue.path.join(".");
        acc[path || "form"] = issue.message;
        return acc;
      },
      {},
    );

    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const data = validation.data;
  const supabase = await createClient();

  // Explicit field listing for type safety
  const { error } = await supabase.from("settings").upsert(
    {
      singleton_key: "business",
      business_name: data.business_name,
      tagline: toUndefined(data.tagline),
      registration_number: toUndefined(data.registration_number),
      kra_pin: toUndefined(data.kra_pin),
      logo_url: toUndefined(data.logo_url),
      favicon_url: toUndefined(data.favicon_url),
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      phone_primary: toUndefined(data.phone_primary),
      phone_secondary: toUndefined(data.phone_secondary),
      whatsapp_number: toUndefined(data.whatsapp_number),
      email: toUndefined(data.email),
      website: toUndefined(data.website),
      address: toUndefined(data.address),
      building: toUndefined(data.building),
      street: toUndefined(data.street),
      city: toUndefined(data.city),
      county: toUndefined(data.county),
      country: data.country,
      google_maps_url: toUndefined(data.google_maps_url),
      business_hours: data.business_hours,
      facebook: toUndefined(data.facebook),
      instagram: toUndefined(data.instagram),
      linkedin: toUndefined(data.linkedin),
      tiktok: toUndefined(data.tiktok),
      youtube: toUndefined(data.youtube),
      x: toUndefined(data.x),
      default_meta_title: toUndefined(data.default_meta_title),
      default_meta_description: toUndefined(data.default_meta_description),
      default_keywords: toUndefined(data.default_keywords),
      default_terms: toUndefined(data.default_terms),
      default_notes: toUndefined(data.default_notes),
      default_validity_days: data.default_validity_days,
      currency: data.currency,
      currency_symbol: data.currency_symbol,
      vat_enabled: data.vat_enabled,
      default_vat_percentage: data.default_vat_percentage,
      default_delivery_message: toUndefined(data.default_delivery_message),
      default_pickup_message: toUndefined(data.default_pickup_message),
      mpesa_paybill: toUndefined(data.mpesa_paybill),
      mpesa_till: toUndefined(data.mpesa_till),
      mpesa_account_name: toUndefined(data.mpesa_account_name),
      payments_enabled: data.payments_enabled,
      maintenance_mode: data.maintenance_mode,
      allow_guest_orders: data.allow_guest_orders,
      allow_guest_checkout: data.allow_guest_checkout,
    },
    { onConflict: "singleton_key" },
  );

  if (error) {
    return { success: false, error: mapSupabaseError(error.message) };
  }

  // Revalidate the entire app since settings affect many pages
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");

  return { success: true };
}
