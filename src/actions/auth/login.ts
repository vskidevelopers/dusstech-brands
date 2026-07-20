"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/schemas/auth";

export type LoginActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Maps Supabase auth errors to user-friendly messages.
 */
function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Invalid email or password. Please try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (lower.includes("too many")) {
    return "Too many login attempts. Please try again later.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Unable to connect. Please check your internet connection.";
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Authenticates the admin user.
 * Returns a result object so the client can display toasts and handle UI state.
 */
export async function loginAction(
  formData: LoginInput,
): Promise<LoginActionResult> {
  // 1. Validate input with Zod
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { email, password } = validation.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    // Revalidate the cache so the server sees the new session immediately
    revalidatePath("/admin", "layout");
  } catch (err) {
    console.error("[loginAction] Unexpected error:", err);
    return {
      success: false,
      error: "A network error occurred. Please try again.",
    };
  }

  // Redirect only after successful auth — outside the try/catch so it doesn't get caught
  redirect("/admin");
}
