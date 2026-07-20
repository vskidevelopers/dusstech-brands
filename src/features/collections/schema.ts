import { z } from "zod";

export const collectionInputSchema = z.object({
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
  featured: z.boolean(),
  active: z.boolean(),
});

export const collectionSchema = collectionInputSchema.transform((data) => ({
  ...data,
  description: data.description || null,
}));

export type CollectionFormData = z.infer<typeof collectionInputSchema>;
export type CollectionOutput = z.infer<typeof collectionSchema>;
