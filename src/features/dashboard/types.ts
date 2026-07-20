import { ReactNode } from "react";

export interface StatCardData {
  label: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
  accent: string; // Tailwind bg color class for icon container
  accentText: string; // Tailwind text color class for icon
}

export interface QuickActionData {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  accent: string;
  accentText: string;
}

export interface OrderRow {
  id: string;
  customer: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  amount: string;
}

export interface QuoteRow {
  id: string;
  customer: string;
  status: "draft" | "sent" | "accepted" | "declined";
  created: string;
  total: string;
}

export interface BusinessInfo {
  name: string;
  location: {
    building: string;
    road: string;
    city: string;
  };
  motto: string;
}
