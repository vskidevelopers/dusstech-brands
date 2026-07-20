import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Settings } from "./types";

// Re-export pure utilities for convenience
export { parseBusinessHours, formatFullAddress } from "./utils";

/**
 * Cached getter for business settings.
 * Uses React's `cache()` to ensure a single DB hit per request.
 */
export const getBusinessSettings = cache(async (): Promise<Settings | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("singleton_key", "business")
    .single();

  if (error || !data) {
    console.error("[getBusinessSettings]", error);
    return null;
  }

  return data as Settings;
});
