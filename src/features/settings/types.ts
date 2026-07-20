/* eslint-disable @typescript-eslint/no-explicit-any */
// Replace this:
// export type Settings = Record<string, unknown>;

// With this temporary fallback:
export interface Settings {
  id: string;
  singleton_key: string;
  business_name: string;
  tagline: string | null;
  registration_number: string | null;
  kra_pin: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  phone_primary: string | null;
  phone_secondary: string | null;
  whatsapp_number: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  building: string | null;
  street: string | null;
  city: string | null;
  county: string | null;
  country: string;
  google_maps_url: string | null;
  business_hours: any;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  x: string | null;
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_keywords: string | null;
  default_terms: string | null;
  default_notes: string | null;
  default_validity_days: number;
  currency: string;
  currency_symbol: string;
  vat_enabled: boolean;
  default_vat_percentage: number;
  default_delivery_message: string | null;
  default_pickup_message: string | null;
  mpesa_paybill: string | null;
  mpesa_till: string | null;
  mpesa_account_name: string | null;
  payments_enabled: boolean;
  maintenance_mode: boolean;
  allow_guest_orders: boolean;
  allow_guest_checkout: boolean;
  created_at: string;
  updated_at: string;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DaySchedule {
  isOpen: boolean;
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

export type BusinessHours = Record<DayOfWeek, DaySchedule>;

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export interface SettingsActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}
