/**
 * Converts a string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^\w-]+/g, "") // strip non-word chars
    .replace(/--+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}
