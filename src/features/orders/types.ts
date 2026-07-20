import type { Tables } from "@/types/database";

export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderTimelineEvent = Record<string, unknown>;

export type OrderSource = "website" | "quotation" | "admin";
export type DeliveryMethod = "pickup" | "delivery";
export type PaymentOption = "pay_later" | "mpesa";
export type PaymentStatus = "pending" | "partially_paid" | "paid" | "refunded";
export type ProductionStatus =
  | "new"
  | "awaiting_review"
  | "artwork"
  | "awaiting_approval"
  | "approved"
  | "production"
  | "quality_check"
  | "ready"
  | "completed"
  | "cancelled"
  | "on_hold";

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderWithTimeline extends OrderWithItems {
  timeline: OrderTimelineEvent[];
}

export interface OrderFilters {
  search?: string;
  productionStatus?: ProductionStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  source?: OrderSource | "all";
  page?: number;
  pageSize?: number;
}

export interface OrderPaginatedResult {
  data: Order[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export interface CustomerOrderHistory {
  totalOrders: number;
  latestOrderDate: string | null;
  recentOrders: Order[];
}

/**
 * Human-readable labels for production status transitions.
 * Used by the timeline.
 */
export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  new: "Order Created",
  awaiting_review: "Awaiting Review",
  artwork: "Artwork Started",
  awaiting_approval: "Awaiting Client Approval",
  approved: "Artwork Approved",
  production: "Production Started",
  quality_check: "Quality Check",
  ready: "Ready for Pickup/Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  on_hold: "On Hold",
};
