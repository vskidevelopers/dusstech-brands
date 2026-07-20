import type { Settings, BusinessHours } from "./types";

/**
 * Helper to safely parse business hours from the JSONB field.
 * Pure function — no server dependencies.
 */
export function parseBusinessHours(
  settings: Settings | null,
): BusinessHours | null {
  if (!settings?.business_hours) return null;
  try {
    return settings.business_hours as unknown as BusinessHours;
  } catch {
    return null;
  }
}

/**
 * Helper to build a full address string from settings.
 * Pure function — no server dependencies.
 */
export function formatFullAddress(settings: Settings | null): string {
  if (!settings) return "";
  const parts = [
    settings.building,
    settings.street,
    settings.address,
    settings.city,
    settings.county,
    settings.country,
  ].filter(Boolean);
  return parts.join(", ");
}
