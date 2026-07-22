"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactFormAction(data: ContactFormData) {
  // Validate
  const validation = contactSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid form data" };
  }

  // TODO: Future integration - Send to Resend, SendGrid, or save to Supabase
  console.log("📩 [Contact Form] Submission received:", validation.data);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Message sent successfully! We'll get back to you soon.",
  };
}
