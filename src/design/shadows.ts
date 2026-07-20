/**
 * Soft, premium shadows. No harsh blacks.
 * Uses layered shadows for depth (like Linear/Vercel).
 */
export const shadows = {
  none: "none",

  // Subtle - for cards at rest
  sm: "0 1px 2px 0 hsl(var(--foreground) / 0.04)",

  // Default card shadow
  md: `
    0 1px 2px 0 hsl(var(--foreground) / 0.04),
    0 2px 8px -2px hsl(var(--foreground) / 0.06)
  `
    .replace(/\s+/g, " ")
    .trim(),

  // Elevated - hover states, dropdowns
  lg: `
    0 4px 6px -1px hsl(var(--foreground) / 0.04),
    0 12px 24px -6px hsl(var(--foreground) / 0.08)
  `
    .replace(/\s+/g, " ")
    .trim(),

  // Floating - modals, dialogs
  xl: `
    0 8px 16px -4px hsl(var(--foreground) / 0.06),
    0 24px 48px -12px hsl(var(--foreground) / 0.12)
  `
    .replace(/\s+/g, " ")
    .trim(),

  // Premium - hero elements, CTAs
  "2xl": `
    0 12px 24px -6px hsl(var(--primary) / 0.12),
    0 32px 64px -16px hsl(var(--primary) / 0.16)
  `
    .replace(/\s+/g, " ")
    .trim(),

  // Inner - pressed states
  inner: "inset 0 2px 4px 0 hsl(var(--foreground) / 0.04)",

  // Glow - accent elements
  glow: "0 0 40px 8px hsl(var(--primary) / 0.15)",
} as const;

export type ShadowToken = keyof typeof shadows;
