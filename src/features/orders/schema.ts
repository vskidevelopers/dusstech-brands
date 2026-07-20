import { z } from "zod";
import { lineItemSchema } from "@/types/line-item";

export const orderInputSchema = z
  .object({
    source: z.enum(["website", "quotation", "admin"]),
    quotation_id: z.string().uuid().nullable().optional(),
    customer_name: z.string().min(2, "Customer name is required"),
    company_name: z.string().optional().or(z.literal("")),
    phone: z.string().min(5, "Phone number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    delivery_method: z.enum(["pickup", "delivery"]),
    delivery_location: z.string().optional().or(z.literal("")),
    delivery_fee: z.coerce.number().min(0, "Delivery fee must be >= 0"),
    payment_option: z.enum(["pay_later", "mpesa"]),
    payment_status: z.enum(["pending", "partially_paid", "paid", "refunded"]),
    production_status: z.enum([
      "new",
      "awaiting_review",
      "artwork",
      "awaiting_approval",
      "approved",
      "production",
      "quality_check",
      "ready",
      "completed",
      "cancelled",
      "on_hold",
    ]),
    notes: z.string().optional().or(z.literal("")),
    discount: z.coerce.number().min(0, "Discount must be >= 0"),
    vat_enabled: z.boolean(),
    vat_percentage: z.coerce.number().min(0).max(100),
    items: z.array(lineItemSchema).min(1, "At least one line item is required"),
  })
  .superRefine((data, ctx) => {
    if (
      data.delivery_method === "delivery" &&
      !data.delivery_location?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Delivery location is required when delivery method is selected",
        path: ["delivery_location"],
      });
    }
  });

export type OrderFormData = z.infer<typeof orderInputSchema>;
