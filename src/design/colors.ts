/**
 * Semantic color tokens for the Dusstech public website.
 * These map to CSS variables defined in globals.css.
 * Components should NEVER use raw hex values.
 */
export const colors = {
  // Brand
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
    50: "hsl(var(--primary-50))",
    100: "hsl(var(--primary-100))",
    200: "hsl(var(--primary-200))",
    300: "hsl(var(--primary-300))",
    400: "hsl(var(--primary-400))",
    500: "hsl(var(--primary-500))",
    600: "hsl(var(--primary-600))",
    700: "hsl(var(--primary-700))",
    800: "hsl(var(--primary-800))",
    900: "hsl(var(--primary-900))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },

  // Surfaces
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  surface: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
    elevated: "hsl(var(--popover))",
    muted: "hsl(var(--muted))",
  },

  // Semantic
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  danger: "hsl(var(--destructive))",
  info: "hsl(var(--info))",

  // Utility
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  border: {
    DEFAULT: "hsl(var(--border))",
    subtle: "hsl(var(--border-subtle))",
  },
  ring: "hsl(var(--ring))",

  // Canvas (for large sections)
  canvas: {
    DEFAULT: "hsl(var(--canvas))",
    subtle: "hsl(var(--canvas-subtle))",
  },
} as const;

export type ColorToken = keyof typeof colors;
