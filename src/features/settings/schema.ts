import { z } from "zod";

const dayScheduleSchema = z.object({
  isOpen: z.boolean(),
  open: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  close: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
});

const businessHoursSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));
const optionalEmail = z
  .string()
  .email("Invalid email")
  .optional()
  .or(z.literal(""));
const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6})$/, "Must be a valid hex color (e.g. #FF5733)");

export const settingsSchema = z.object({
  // General
  business_name: z.string().min(2, "Business name is required").max(120),
  tagline: z.string().max(120).optional().or(z.literal("")),
  registration_number: z.string().max(60).optional().or(z.literal("")),
  kra_pin: z.string().max(30).optional().or(z.literal("")),

  // Branding
  logo_url: optionalUrl,
  favicon_url: optionalUrl,
  primary_color: hexColor,
  secondary_color: hexColor,

  // Contact
  phone_primary: z.string().max(30).optional().or(z.literal("")),
  phone_secondary: z.string().max(30).optional().or(z.literal("")),
  whatsapp_number: z.string().max(30).optional().or(z.literal("")),
  email: optionalEmail,
  website: optionalUrl,

  // Location
  address: z.string().max(200).optional().or(z.literal("")),
  building: z.string().max(100).optional().or(z.literal("")),
  street: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(60).optional().or(z.literal("")),
  county: z.string().max(60).optional().or(z.literal("")),
  country: z.string().max(60).default("Kenya"),
  google_maps_url: optionalUrl,

  // Business Hours
  business_hours: businessHoursSchema,

  // Social
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  tiktok: optionalUrl,
  youtube: optionalUrl,
  x: optionalUrl,

  // SEO
  default_meta_title: z.string().max(70).optional().or(z.literal("")),
  default_meta_description: z.string().max(160).optional().or(z.literal("")),
  default_keywords: z.string().max(200).optional().or(z.literal("")),

  // Quotation Defaults
  default_terms: z.string().max(5000).optional().or(z.literal("")),
  default_notes: z.string().max(5000).optional().or(z.literal("")),
  default_validity_days: z.coerce.number().int().min(1).max(365),
  currency: z.string().min(1).max(10),
  currency_symbol: z.string().min(1).max(10),
  vat_enabled: z.boolean(),
  default_vat_percentage: z.coerce.number().min(0).max(100),

  // Order Defaults
  default_delivery_message: z.string().max(500).optional().or(z.literal("")),
  default_pickup_message: z.string().max(500).optional().or(z.literal("")),

  // Payments
  mpesa_paybill: z.string().max(30).optional().or(z.literal("")),
  mpesa_till: z.string().max(30).optional().or(z.literal("")),
  mpesa_account_name: z.string().max(60).optional().or(z.literal("")),
  payments_enabled: z.boolean(),

  // System
  maintenance_mode: z.boolean(),
  allow_guest_orders: z.boolean(),
  allow_guest_checkout: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
