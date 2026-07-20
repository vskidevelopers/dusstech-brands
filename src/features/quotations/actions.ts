/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { quotationInputSchema, type QuotationFormData } from "./schema";
import type { Quotation, QuotationActionResult } from "./types";
import type { Tables } from "@/types/database";
import { getBusinessSettings } from "@/features/settings/service";

// Tables<"quotations"> returns the row type for the quotations table in our
// database typings. There is no nested "Update" property, so use the row
// type directly for update payloads (or a Partial of it where appropriate).
type QuotationUpdate = Partial<Tables<"quotations">>;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface QuotationItemInsert {
  quotation_id: string;
  item_type: string;
  reference_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
  sort_order: number;
}

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate"))
    return "A quotation with this number already exists.";
  if (lower.includes("network") || lower.includes("fetch"))
    return "Unable to connect to the database. Please try again.";
  return "An unexpected error occurred. Please try again.";
}

export async function createQuotationAction(
  formData: QuotationFormData,
): Promise<QuotationActionResult<Quotation>> {
  await requireAuth();

  const validation = quotationInputSchema.safeParse(formData);
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
  const supabase = await createClient();

  // 1. Generate quote number
  const { data: quoteNumberData, error: quoteNumError } = await supabase.rpc(
    "generate_next_quote_number",
  );
  if (quoteNumError || !quoteNumberData) {
    return { success: false, error: "Failed to generate quote number." };
  }

  // 2. Insert quotation
  const { data: quotation, error: qError } = await supabase
    .from("quotations")
    .insert({
      quote_number: quoteNumberData,
      customer_name: data.customer_name,
      company_name: data.company_name || null,
      phone: data.phone || null,
      email: data.email || null,
      valid_until: data.valid_until || null,
      notes: data.notes || null,
      terms: data.terms || null,
      discount: data.discount,
      vat_enabled: data.vat_enabled,
      vat_percentage: data.vat_percentage,
      status: "draft",
      // Totals will be calculated and updated in step 4
    })
    .select()
    .single();

  if (qError || !quotation)
    return { success: false, error: mapSupabaseError(qError?.message || "") };

  // 3. Insert items
  const itemsToInsert: QuotationItemInsert[] = data.items.map((item, index) => {
    const row: QuotationItemInsert = {
      quotation_id: quotation.id,
      item_type: item.item_type,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      line_total: item.line_total,
      sort_order: index,
    };

    if (item.reference_id != null) row.reference_id = item.reference_id;
    return row;
  });

  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(itemsToInsert);
  if (itemsError) {
    // Rollback: delete the quotation if items fail
    await supabase.from("quotations").delete().eq("id", quotation.id);
    return { success: false, error: mapSupabaseError(itemsError.message) };
  }

  // 4. Recalculate and update totals
  await updateQuotationTotals(supabase, quotation.id, data);

  revalidatePath("/admin/quotations");
  return { success: true, data: quotation };
}

export async function updateQuotationAction(
  id: string,
  formData: QuotationFormData,
): Promise<QuotationActionResult<Quotation>> {
  await requireAuth();

  const validation = quotationInputSchema.safeParse(formData);
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
  const supabase = await createClient();

  const { error: qError } = await supabase
    .from("quotations")
    .update({
      customer_name: data.customer_name,
      company_name: data.company_name || null,
      phone: data.phone || null,
      email: data.email || null,
      valid_until: data.valid_until || null,
      notes: data.notes || null,
      terms: data.terms || null,
      discount: data.discount,
      vat_enabled: data.vat_enabled,
      vat_percentage: data.vat_percentage,
    })
    .eq("id", id);

  if (qError)
    return { success: false, error: mapSupabaseError(qError.message) };

  // Delete existing items and insert new ones (simpler than diffing for this scale)
  await supabase.from("quotation_items").delete().eq("quotation_id", id);

  const itemsToInsert: QuotationItemInsert[] = data.items.map((item, index) => {
    const row: QuotationItemInsert = {
      quotation_id: id,
      item_type: item.item_type,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      line_total: item.line_total,
      sort_order: index,
    };

    if (item.reference_id != null) row.reference_id = item.reference_id;
    return row;
  });

  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(itemsToInsert);
  if (itemsError)
    return { success: false, error: mapSupabaseError(itemsError.message) };

  await updateQuotationTotals(supabase, id, data);

  revalidatePath("/admin/quotations");
  revalidatePath(`/admin/quotations/${id}/edit`);
  return { success: true };
}

async function updateQuotationTotals(
  supabase: any,
  id: string,
  data: QuotationFormData,
) {
  const subtotal = data.items.reduce((sum, item) => sum + item.line_total, 0);
  const discount = data.discount;
  const vatAmount = data.vat_enabled
    ? subtotal * (data.vat_percentage / 100)
    : 0;
  const grandTotal = subtotal - discount + vatAmount;

  await supabase
    .from("quotations")
    .update({
      subtotal,
      discount,
      vat_amount: vatAmount,
      grand_total: grandTotal,
    })
    .eq("id", id);
}

export async function duplicateQuotationAction(
  id: string,
): Promise<QuotationActionResult<Quotation>> {
  await requireAuth();
  const supabase = await createClient();

  // Fetch the original quotation with its items
  const { data: original, error: fetchError } = await supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .eq("id", id)
    .single();

  if (fetchError || !original) {
    return { success: false, error: "Quotation not found." };
  }

  // Generate new quote number
  const { data: quoteNumberData, error: quoteNumError } = await supabase.rpc(
    "generate_next_quote_number",
  );

  if (quoteNumError || !quoteNumberData) {
    return { success: false, error: "Failed to generate quote number." };
  }

  // Insert the duplicated quotation
  const { data: newQuotation, error: insertError } = await supabase
    .from("quotations")
    .insert({
      quote_number: quoteNumberData,
      customer_name: original.customer_name,
      company_name: original.company_name ?? null,
      phone: original.phone ?? null,
      email: original.email ?? null,
      valid_until: original.valid_until ?? null,
      notes: original.notes ?? null,
      terms: original.terms ?? null, // FIXED: was original.ats
      discount: original.discount,
      vat_enabled: original.vat_enabled,
      vat_percentage: original.vat_percentage,
      status: "draft",
      subtotal: original.subtotal,
      vat_amount: original.vat_amount,
      grand_total: original.grand_total,
    })
    .select()
    .single();

  if (insertError || !newQuotation) {
    return {
      success: false,
      error: mapSupabaseError(insertError?.message || ""),
    };
  }

  // Duplicate the line items
  const itemsToInsert = (original.quotation_items || []).map(
    (item: any, index: number) => ({
      quotation_id: newQuotation.id,
      item_type: item.item_type,
      reference_id: item.reference_id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      line_total: item.line_total,
      sort_order: index,
    }),
  );

  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // Rollback: delete the new quotation if items fail
    await supabase.from("quotations").delete().eq("id", newQuotation.id);
    return { success: false, error: mapSupabaseError(itemsError.message) };
  }

  revalidatePath("/admin/quotations");
  return { success: true, data: newQuotation };
}

export async function updateQuotationStatusAction(
  id: string,
  status: "draft" | "sent" | "approved" | "rejected" | "expired" | "converted",
): Promise<QuotationActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const updateData: QuotationUpdate = { status };
  const { error } = await supabase
    .from("quotations")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/quotations");
  revalidatePath(`/admin/quotations/${id}/edit`);
  return { success: true };
}

/**
 * Fetches a quotation and its items, along with current business settings,
 * specifically for PDF generation.
 */
export async function getQuotationPdfDataAction(id: string) {
  await requireAuth();
  const supabase = await createClient();

  // 1. Fetch the quotation with all its line items
  const { data: quotation, error } = await supabase
    .from("quotations")
    .select("*, items:quotation_items(*)")
    .eq("id", id)
    .single();

  if (error || !quotation) {
    console.error(
      "[getQuotationPdfDataAction] Failed to fetch quotation:",
      error,
    );
    return null;
  }

  // 2. Fetch the current business settings
  const settings = await getBusinessSettings();

  if (!settings) {
    console.error(
      "[getQuotationPdfDataAction] Failed to fetch business settings",
    );
    return null;
  }

  // 3. Return both for the PDF generator
  return { quotation, settings };
}
