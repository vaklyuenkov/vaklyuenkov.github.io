/** Resolve asset/data URL for GitHub Pages `base` */
export function publicUrl(relativePath: string): string {
  const base = import.meta.env.BASE_URL;
  const path = relativePath.replace(/^\/+/, "");
  return `${base}${path}`;
}
