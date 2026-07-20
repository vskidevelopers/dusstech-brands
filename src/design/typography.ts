/**
 * Typography scale.
 * Each level defines size, weight, line-height, and letter-spacing.
 * Use the <Heading> and <Text> components instead of raw classes.
 */
export const typography = {
  display: {
    fontSize: "clamp(3rem, 6vw, 5.5rem)",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  h1: {
    fontSize: "clamp(2.25rem, 4vw, 3.75rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.025em",
  },
  h2: {
    fontSize: "clamp(1.875rem, 3vw, 3rem)",
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontSize: "clamp(1.5rem, 2.25vw, 2.25rem)",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
  },
  h4: {
    fontSize: "clamp(1.25rem, 1.75vw, 1.75rem)",
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },
  body: {
    fontSize: "1.0625rem", // 17px - slightly larger for readability
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: "-0.003em",
  },
  bodyLarge: {
    fontSize: "1.1875rem",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: "-0.003em",
  },
  small: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0",
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.01em",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  button: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: "-0.005em",
  },
} as const;

export type TypographyLevel = keyof typeof typography;
