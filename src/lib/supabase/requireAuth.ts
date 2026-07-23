import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * 1. STRICT AUTH: For Admin Server Actions & Mutations ONLY.
 * If no user is found, it forcefully redirects to /login.
 *
 * USE THIS IN: src/features/orders/actions.ts, src/features/settings/actions.ts, etc.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This is safe here because this function should ONLY be called
    // inside protected Admin Server Actions.
    redirect("/login");
  }

  return user;
}

/**
 * 2. OPTIONAL AUTH: For Public Website Pages & Components.
 * Checks if a user is logged in, but NEVER redirects.
 * Returns `null` safely for guests.
 *
 * USE THIS IN: src/app/(website)/layout.tsx, Navbar, public data fetchers.
 */
export async function getOptionalUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user; // Returns the user object, or null if guest
}
