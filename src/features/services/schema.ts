import { z } from "zod";

export const serviceInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be 120 characters or less"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  short_description: z
    .string()
    .max(200, "Short description must be 200 characters or less")
    .optional(),
  description: z.string().max(5000, "Description is too long").optional(),
  category_id: z.string().uuid().optional().nullable(),
  collection_ids: z.array(z.string().uuid()).max(20, "Maximum 20 collections"),
  starting_price: z
    .number()
    .min(0, "Price must be 0 or greater")
    .max(99999999.99),
  pricing_type: z.enum(["fixed", "starting_from", "custom_quote"]),
  featured: z.boolean(),
  active: z.boolean(),
  featured_image: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  gallery: z
    .array(z.string().url("Gallery URLs must be valid"))
    .max(20, "Maximum 20 images"),
  turnaround_time: z.string().max(60).optional(),
  whatsapp_message: z.string().max(200).optional(),
  seo_title: z.string().max(70).optional(),
  seo_description: z.string().max(160).optional(),
});

export const serviceSchema = serviceInputSchema.transform((data) => ({
  ...data,
  short_description: data.short_description || null,
  description: data.description || null,
  category_id: data.category_id || null,
  featured_image: data.featured_image || null,
  turnaround_time: data.turnaround_time || null,
  whatsapp_message: data.whatsapp_message || null,
  seo_title: data.seo_title || null,
  seo_description: data.seo_description || null,
}));

export type ServiceFormData = z.infer<typeof serviceInputSchema>;
export type ServiceOutput = z.infer<typeof serviceSchema>;
