/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/requireAuth";
import type { OrderRow, QuoteRow } from "./types"; // ✅ Import the existing types

export interface DashboardStats {
  totalServices: number;
  totalProducts: number;
  totalOrders: number;
  totalQuotes: number;
  activeServices: number;
  featuredServices: number;
}

export async function getDashboardStatsAction(): Promise<DashboardStats> {
  await requireAuth();
  const supabase = await createClient();

  const { count: totalServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });
  const { count: activeServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("active", true);
  const { count: featuredServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });
  const { count: totalQuotes } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true });

  return {
    totalServices: totalServices || 0,
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalQuotes: totalQuotes || 0,
    activeServices: activeServices || 0,
    featuredServices: featuredServices || 0,
  };
}

export async function getRecentOrdersAction(limit = 5): Promise<OrderRow[]> {
  await requireAuth();
  const supabase = await createClient();

  // ✅ Added 'id' to the select statement
  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, total_amount, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  return (data || []).map((order: any) => ({
    id: order.id,
    customer: order.customer_name || "Unknown Customer",
    status: "processing", // Safe default since column doesn't exist
    date: new Date(order.created_at).toLocaleDateString(),
    amount: order.total_amount || 0,
  }));
}

export async function getRecentQuotesAction(limit = 5): Promise<QuoteRow[]> {
  await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotations")
    .select("id, customer_name, total_amount, created_at, status")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent quotes:", error);
    return [];
  }

  // ✅ Map to include the 'id' property required by types.ts
  return (data || []).map((quote: any) => ({
    id: quote.id,
    customer: quote.customer_name || "Unknown Customer",
    status: quote.status || "draft",
    created: new Date(quote.created_at).toLocaleDateString(),
    total: quote.total_amount || 0,
  }));
}
