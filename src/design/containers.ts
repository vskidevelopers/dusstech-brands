export const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1200px", // Standard content
  "2xl": "1400px", // Wide layouts
  full: "100%",
} as const;

export type ContainerSize = keyof typeof containers;
