import { z } from 'zod';

export const itemTypeSchema = z.enum(['service', 'product', 'custom']);
export type ItemType = z.infer<typeof itemTypeSchema>;

export const lineItemSchema = z.object({
  id: z.string().uuid().optional(),
  item_type: itemTypeSchema,
  reference_id: z.string().uuid().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be > 0'),
  unit_price: z.coerce.number().min(0, 'Price must be >= 0'),
  discount: z.coerce.number().min(0, 'Discount must be >= 0'),
  line_total: z.coerce.number().min(0),
  sort_order: z.number().int(),
});

export type LineItemFormValues = z.infer<typeof lineItemSchema>;