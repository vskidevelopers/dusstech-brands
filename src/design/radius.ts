export const radius = {
  none: "0",
  sm: "0.375rem", // 6px - small elements (chips, badges)
  md: "0.75rem", // 12px - buttons, inputs
  lg: "1rem", // 16px - cards
  xl: "1.5rem", // 24px - large cards, modals
  "2xl": "2rem", // 32px - hero cards
  "3xl": "2.5rem", // 40px - feature sections
  full: "9999px", // pills, avatars
} as const;

export type RadiusToken = keyof typeof radius;
