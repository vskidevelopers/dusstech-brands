/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type {
  Order,
  OrderFilters,
  OrderPaginatedResult,
  OrderWithTimeline,
  CustomerOrderHistory,
} from "./types";

export async function getOrders(
  filters: OrderFilters = {},
): Promise<OrderPaginatedResult> {
  await requireAuth();

  const supabase = await createClient();
  const {
    search,
    productionStatus = "all",
    paymentStatus = "all",
    source = "all",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (productionStatus !== "all")
    query = query.eq("production_status", productionStatus);
  if (paymentStatus !== "all")
    query = query.eq("payment_status", paymentStatus);
  if (source !== "all") query = query.eq("source", source);

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query = query.or(
      `customer_name.ilike.%${term}%,company_name.ilike.%${term}%,order_number.ilike.%${term}%,phone.ilike.%${term}%`,
    );
  }

  query = query.order("created_at", { ascending: false });

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getOrders]", error);
    return {
      data: [],
      count: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 0,
    };
  }

  const totalCount = count ?? 0;
  return {
    data: data ?? [],
    count: totalCount,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
  };
}

export async function getOrderById(
  id: string,
): Promise<OrderWithTimeline | null> {
  await requireAuth();

  const supabase = await createClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, items:order_items(*), timeline:order_timeline(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (orderError || !order) return null;

  return {
    ...order,
    items: order.items ?? [],
    timeline: (order.timeline ?? []).sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  };
}

/**
 * Look up a customer's order history by phone number.
 * Used by the PreviousOrdersCard.
 */
export async function getCustomerOrderHistory(
  phone: string,
  excludeOrderId?: string,
): Promise<CustomerOrderHistory> {
  await requireAuth();

  if (!phone || phone.trim().length < 5) {
    return { totalOrders: 0, latestOrderDate: null, recentOrders: [] };
  }

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, grand_total, production_status, created_at",
    )
    .eq("phone", phone.trim())
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  if (excludeOrderId) {
    query = query.neq("id", excludeOrderId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { totalOrders: 0, latestOrderDate: null, recentOrders: [] };
  }

  // Get total count separately
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("phone", phone.trim())
    .is("deleted_at", null);

  return {
    totalOrders: count ?? data.length,
    latestOrderDate: data[0]?.created_at ?? null,
    recentOrders: data as Order[],
  };
}
