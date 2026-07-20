/**
 * Subtle, premium gradients. Use sparingly.
 */
export const gradients = {
  // Primary brand gradient
  primary:
    "linear-gradient(135deg, hsl(var(--primary-500)) 0%, hsl(var(--primary-700)) 100%)",

  // Soft surface gradient for sections
  surface:
    "linear-gradient(180deg, hsl(var(--canvas)) 0%, hsl(var(--background)) 100%)",

  // Subtle card gradient
  card: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.3) 100%)",

  // Accent highlight
  accent:
    "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--accent) / 0.1) 100%)",

  // Glass effect (subtle)
  glass:
    "linear-gradient(135deg, hsl(var(--background) / 0.7) 0%, hsl(var(--background) / 0.4) 100%)",

  // Mesh background (hero sections)
  mesh: `
    radial-gradient(at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
    radial-gradient(at 80% 80%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
    radial-gradient(at 50% 50%, hsl(var(--primary-300) / 0.08) 0%, transparent 50%)
  `
    .replace(/\s+/g, " ")
    .trim(),
} as const;

export type GradientToken = keyof typeof gradients;
