import { z } from "zod";

export const productInputSchema = z
  .object({
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
    collection_ids: z
      .array(z.string().uuid())
      .max(20, "Maximum 20 collections"),
    selling_price: z
      .number()
      .min(0, "Selling price must be 0 or greater")
      .max(99999999.99),
    compare_at_price: z.number().min(0).max(99999999.99).optional().nullable(),
    branding_included: z.boolean(),
    branding_notes: z.string().max(500).optional(),
    material: z.string().max(60).optional(),
    color: z.string().max(60).optional(),
    size: z.string().max(60).optional(),
    capacity: z.string().max(60).optional(),
    minimum_order_quantity: z.number().int().min(1, "MOQ must be at least 1"),
    lead_time: z.string().max(60).optional(),
    featured_image: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    gallery: z
      .array(z.string().url("Gallery URLs must be valid"))
      .max(20, "Maximum 20 images"),
    featured: z.boolean(),
    new_arrival: z.boolean(),
    popular: z.boolean(),
    whatsapp_message: z.string().max(200).optional(),
    seo_title: z.string().max(70).optional(),
    seo_description: z.string().max(160).optional(),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.compare_at_price !== null &&
      data.compare_at_price !== undefined &&
      data.compare_at_price > 0 &&
      data.compare_at_price <= data.selling_price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Compare-at price must be greater than selling price",
        path: ["compare_at_price"],
      });
    }
  });

export const productSchema = productInputSchema.transform((data) => ({
  ...data,
  short_description: data.short_description || null,
  description: data.description || null,
  category_id: data.category_id || null,
  compare_at_price: data.compare_at_price ?? null,
  branding_notes: data.branding_notes || null,
  material: data.material || null,
  color: data.color || null,
  size: data.size || null,
  capacity: data.capacity || null,
  lead_time: data.lead_time || null,
  featured_image: data.featured_image || null,
  whatsapp_message: data.whatsapp_message || null,
  seo_title: data.seo_title || null,
  seo_description: data.seo_description || null,
}));

export type ProductFormData = z.infer<typeof productInputSchema>;
export type ProductOutput = z.infer<typeof productSchema>;
