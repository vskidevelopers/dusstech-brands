import { z } from "zod";
import { lineItemSchema } from "@/types/line-item";

export const quotationInputSchema = z.object({
  customer_name: z.string().min(2, "Customer name is required"),
  company_name: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  valid_until: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  terms: z.string().optional().or(z.literal("")),
  discount: z.coerce.number().min(0, "Discount must be >= 0"),
  vat_enabled: z.boolean(),
  vat_percentage: z.coerce.number().min(0).max(100),
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

export type QuotationFormData = z.infer<typeof quotationInputSchema>;
