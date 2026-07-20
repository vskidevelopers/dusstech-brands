import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  icon: z.string().max(50).optional(),
  sort_order: z.number().int().min(0).max(9999),
  featured: z.boolean(),
  active: z.boolean(),
});

export const categorySchema = categoryInputSchema.transform((data) => ({
  ...data,
  description: data.description || null,
  icon: data.icon || null,
}));

export type CategoryFormData = z.infer<typeof categoryInputSchema>;
export type CategoryOutput = z.infer<typeof categorySchema>;
