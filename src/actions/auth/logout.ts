"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Signs out the admin user and redirects to the login page.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();

  // Check if a session exists before attempting sign-out
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
