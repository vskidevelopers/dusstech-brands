import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Enforces authentication at the Server Action / Data Access layer.
 * Call this at the top of any Server Action that mutates or reads sensitive data.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login if unauthenticated at the server function level
    redirect("/login");
  }

  return user;
}
