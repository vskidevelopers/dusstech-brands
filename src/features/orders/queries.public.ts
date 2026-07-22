/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackOrderByNumberAndPhone(
  orderNumber: string,
  phone: string,
) {
  const supabase = await createClient();

  const cleanPhone = phone.replace(/[^0-9]/g, "");

  console.log("🔍 [Track Order] Searching for:", { orderNumber, cleanPhone });

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        item_type,
        description,
        unit_price,
        quantity,
        line_total
      )
    `,
    )
    .eq("order_number", orderNumber)
    .eq("phone", cleanPhone)
    .single();

  if (error) {
    console.error("❌ [Track Order] Supabase error:", error);
    return { success: false, error: "Order not found" };
  }

  if (!order) {
    console.warn("⚠️ [Track Order] No order found matching criteria");
    return {
      success: false,
      error:
        "Order not found. Please check your order number and phone number.",
    };
  }

  console.log("✅ [Track Order] Order found successfully!");

  // ✅ Map the database column names to the frontend-expected field names
  const mappedItems = (order.order_items || []).map((item: any) => ({
    id: item.id,
    item_type: item.item_type,
    name: item.description, // description → name
    price: item.unit_price, // unit_price → price
    quantity: item.quantity,
    subtotal: item.line_total, // line_total → subtotal
  }));

  return {
    success: true,
    data: {
      order_number: order.order_number,
      status: order.production_status,
      created_at: order.created_at,
      items: mappedItems,
      total: order.grand_total,
      delivery_method: order.delivery_method,
      customer_name: order.customer_name,
    },
  };
}
