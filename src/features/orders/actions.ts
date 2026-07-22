/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { orderInputSchema, type OrderFormData } from "./schema";
import { calculateTotals } from "@/lib/order-calculations";
import {
  PRODUCTION_STATUS_LABELS,
  type Order,
  type OrderActionResult,
  type ProductionStatus,
  type PaymentStatus,
} from "./types";

type OrderUpdate = Partial<{
  payment_status: PaymentStatus;
  production_status: ProductionStatus;
}>;

function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "An order with this number already exists.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect to the database. Please try again.";
  }
  // ✅ TEMPORARY DEBUG: Log the full error to the server console
  console.error("[Order Action Error]", message);
  return `Database error: ${message}`;
}

/**
 * Insert a timeline event for an order.
 */
async function insertTimelineEvent(
  supabase: any,
  orderId: string,
  event: string,
  metadata: Record<string, any> = {},
) {
  await supabase.from("order_timeline").insert({
    order_id: orderId,
    event,
    metadata,
  });
}

/**
 * Update financial totals on the order row.
 */
async function updateOrderTotals(
  supabase: any,
  id: string,
  data: OrderFormData,
) {
  const totals = calculateTotals(
    data.items,
    data.discount,
    data.vat_enabled,
    data.vat_percentage,
    data.delivery_fee,
  );

  await supabase
    .from("orders")
    .update({
      subtotal: totals.subtotal,
      discount: totals.discount,
      vat_amount: totals.vatAmount,
      grand_total: totals.finalTotal,
    })
    .eq("id", id);
}

export async function createOrderAction(
  formData: OrderFormData,
): Promise<OrderActionResult<Order>> {
  await requireAuth();

  const validation = orderInputSchema.safeParse(formData);
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

  // 1. Generate order number
  console.log("[createOrderAction] Generating order number...");
  const { data: orderNumberData, error: orderNumError } = await supabase.rpc(
    "generate_next_order_number",
  );

  if (orderNumError || !orderNumberData) {
    console.error(
      "[createOrderAction] Failed to generate order number:",
      orderNumError,
    );
    return {
      success: false,
      error: `Failed to generate order number: ${orderNumError?.message || "Unknown error"}`,
    };
  }
  console.log("[createOrderAction] Generated:", orderNumberData);

  // 2. Insert order
  console.log("[createOrderAction] Inserting order...");
  const { data: order, error: oError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumberData,
      source: data.source,
      quotation_id: data.quotation_id ?? null,
      customer_name: data.customer_name,
      company_name: data.company_name || null,
      phone: data.phone,
      email: data.email || null,
      delivery_method: data.delivery_method,
      delivery_location:
        data.delivery_method === "delivery"
          ? data.delivery_location || null
          : null,
      delivery_fee: data.delivery_fee,
      payment_option: data.payment_option,
      payment_status: data.payment_status,
      production_status: data.production_status,
      notes: data.notes || null,
      discount: data.discount,
      vat_enabled: data.vat_enabled,
      vat_percentage: data.vat_percentage,
    })
    .select()
    .single();

  if (oError || !order) {
    console.error("[createOrderAction] Order insert failed:", oError);
    return { success: false, error: mapSupabaseError(oError?.message || "") };
  }
  console.log("[createOrderAction] Order created:", order.id);

  // 3. Insert items
  console.log("[createOrderAction] Inserting items...");
  const itemsToInsert = data.items.map((item, index) => ({
    order_id: order.id,
    item_type: item.item_type,
    reference_id: item.reference_id ?? null,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    line_total: item.line_total,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);
  if (itemsError) {
    console.error("[createOrderAction] Items insert failed:", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, error: mapSupabaseError(itemsError.message) };
  }

  // 4. Update totals
  await updateOrderTotals(supabase, order.id, data);

  // 5. Insert timeline event
  await insertTimelineEvent(
    supabase,
    order.id,
    PRODUCTION_STATUS_LABELS[data.production_status],
  );

  console.log("[createOrderAction] ✅ Order fully created");
  revalidatePath("/admin/orders");
  return { success: true, data: order };
}

export async function updateOrderAction(
  id: string,
  formData: OrderFormData,
): Promise<OrderActionResult<Order>> {
  await requireAuth();

  const validation = orderInputSchema.safeParse(formData);
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

  // Get current production status to detect changes
  const { data: current } = await supabase
    .from("orders")
    .select("production_status")
    .eq("id", id)
    .single();

  const previousStatus = current?.production_status as
    | ProductionStatus
    | undefined;

  const { error: oError } = await supabase
    .from("orders")
    .update({
      source: data.source,
      quotation_id: data.quotation_id ?? null,
      customer_name: data.customer_name,
      company_name: data.company_name || null,
      phone: data.phone,
      email: data.email || null,
      delivery_method: data.delivery_method,
      delivery_location:
        data.delivery_method === "delivery"
          ? data.delivery_location || null
          : null,
      delivery_fee: data.delivery_fee,
      payment_option: data.payment_option,
      payment_status: data.payment_status,
      production_status: data.production_status,
      notes: data.notes || null,
      discount: data.discount,
      vat_enabled: data.vat_enabled,
      vat_percentage: data.vat_percentage,
    })
    .eq("id", id);

  if (oError)
    return { success: false, error: mapSupabaseError(oError.message) };

  // Replace items
  await supabase.from("order_items").delete().eq("order_id", id);

  const itemsToInsert = data.items.map((item, index) => ({
    order_id: id,
    item_type: item.item_type,
    reference_id: item.reference_id ?? null,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    line_total: item.line_total,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);
  if (itemsError)
    return { success: false, error: mapSupabaseError(itemsError.message) };

  await updateOrderTotals(supabase, id, data);

  // If production status changed, log a timeline event
  if (previousStatus && previousStatus !== data.production_status) {
    await insertTimelineEvent(
      supabase,
      id,
      PRODUCTION_STATUS_LABELS[data.production_status],
      { from: previousStatus, to: data.production_status },
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}/edit`);
  return { success: true };
}

export async function duplicateOrderAction(
  id: string,
): Promise<OrderActionResult<Order>> {
  await requireAuth();
  const supabase = await createClient();

  const { data: original, error: fetchError } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (fetchError || !original) {
    return { success: false, error: "Order not found." };
  }

  const { data: orderNumberData } = await supabase.rpc(
    "generate_next_order_number",
  );

  if (orderNumberData == null) {
    return { success: false, error: "Unable to generate order number." };
  }

  const { data: newOrder, error: insertError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumberData,
      source: original.source,
      quotation_id: original.quotation_id ?? null,
      customer_name: original.customer_name,
      company_name: original.company_name ?? null,
      phone: original.phone,
      email: original.email ?? null,
      delivery_method: original.delivery_method,
      delivery_location: original.delivery_location ?? null,
      delivery_fee: original.delivery_fee,
      payment_option: original.payment_option,
      payment_status: "pending", // Reset payment status for duplicates
      production_status: "new", // Reset production status for duplicates
      notes: original.notes ?? null,
      subtotal: original.subtotal,
      discount: original.discount,
      vat_enabled: original.vat_enabled,
      vat_percentage: original.vat_percentage,
      vat_amount: original.vat_amount,
      grand_total: original.grand_total,
    })
    .select()
    .single();

  if (insertError || !newOrder) {
    return {
      success: false,
      error: mapSupabaseError(insertError?.message || ""),
    };
  }

  const itemsToInsert = (original.items || []).map(
    (item: any, index: number) => ({
      order_id: newOrder.id,
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

  await supabase.from("order_items").insert(itemsToInsert);
  await insertTimelineEvent(supabase, newOrder.id, "Order Duplicated", {
    from: original.order_number,
  });

  revalidatePath("/admin/orders");
  return { success: true, data: newOrder };
}

export async function updateProductionStatusAction(
  id: string,
  status: ProductionStatus,
): Promise<OrderActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const updateData: OrderUpdate = { production_status: status };
  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  await insertTimelineEvent(supabase, id, PRODUCTION_STATUS_LABELS[status], {
    to: status,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}/edit`);
  return { success: true };
}

export async function updatePaymentStatusAction(
  id: string,
  status: PaymentStatus,
): Promise<OrderActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const updateData: OrderUpdate = { payment_status: status };
  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  const labels: Record<PaymentStatus, string> = {
    pending: "Payment Pending",
    partially_paid: "Partial Payment Received",
    paid: "Payment Completed",
    refunded: "Payment Refunded",
  };
  await insertTimelineEvent(supabase, id, labels[status], {
    payment_status: status,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}/edit`);
  return { success: true };
}

export async function deleteOrderAction(
  id: string,
): Promise<OrderActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: mapSupabaseError(error.message) };

  revalidatePath("/admin/orders");
  return { success: true };
}

/**
 * Dedicated action for anonymous website checkout.
 * Bypasses requireAuth() and provides safe defaults for admin-only fields.
 */
export async function createWebsiteOrderAction(input: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  customer_company?: string | null;
  delivery_method: "pickup" | "delivery";
  delivery_location?: string | null;
  payment_option: "pay_later" | "mpesa";
  items: {
    type: "product" | "service";
    item_id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}): Promise<OrderActionResult<Order>> {
  const supabase = await createClient();

  // 1. Map website cart items to the schema your DB expects
  const orderItems = input.items.map((item) => ({
    item_type: item.type,
    reference_id: item.item_id,
    description: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    discount: 0,
    line_total: item.subtotal,
  }));

  // 2. Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const deliveryFee = 0; // Admin will update this later
  const grandTotal = subtotal + deliveryFee;

  // 3. Generate order number
  const { data: orderNumberData, error: orderNumError } = await supabase.rpc(
    "generate_next_order_number",
  );

  if (orderNumError || !orderNumberData) {
    return {
      success: false,
      error: `Failed to generate order number: ${orderNumError?.message || "Unknown error"}`,
    };
  }

  // 4. Insert order (with safe defaults for website)
  const { data: order, error: oError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumberData,
      source: "website",
      quotation_id: null,
      customer_name: input.customer_name,
      company_name: input.customer_company || null,
      phone: input.customer_phone,
      email: input.customer_email || null,
      delivery_method: input.delivery_method,
      delivery_location:
        input.delivery_method === "delivery"
          ? input.delivery_location || null
          : null,
      delivery_fee: deliveryFee,
      payment_option: input.payment_option,
      payment_status: "pending",
      production_status: "new",
      notes: "Order placed via website checkout.",
      discount: 0,
      vat_enabled: false,
      vat_percentage: 0,
      subtotal: subtotal,
      vat_amount: 0,
      grand_total: grandTotal,
    })
    .select()
    .single();

  if (oError || !order) {
    return { success: false, error: mapSupabaseError(oError?.message || "") };
  }

  // 5. Insert items
  const itemsToInsert = orderItems.map((item, index) => ({
    order_id: order.id,
    item_type: item.item_type,
    reference_id: item.reference_id ?? null,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    line_total: item.line_total,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // Rollback the order if items fail to insert
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, error: mapSupabaseError(itemsError.message) };
  }

  // 6. Insert timeline event
  await supabase.from("order_timeline").insert({
    order_id: order.id,
    event: PRODUCTION_STATUS_LABELS["new"],
  });

  console.log(
    "[createWebsiteOrderAction] ✅ Order fully created:",
    order.order_number,
  );

  // Revalidate admin orders page so it shows up immediately for the admin
  revalidatePath("/admin/orders");

  return { success: true, data: order };
}
