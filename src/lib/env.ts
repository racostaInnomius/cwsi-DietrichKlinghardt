const value = (key: string, fallback = "") =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const env = {
  SITE_URL: value("VITE_PUBLIC_SITE_URL", "http://localhost:4325"),
  API_URL: value("VITE_PUBLIC_API_URL", "http://localhost:3500"),
  CMS_URL: value("VITE_PUBLIC_CMS_URL", "http://localhost:3000"),
  TENANT_ID: value("VITE_PUBLIC_TENANT_ID"),
  SITE_ID: value("VITE_PUBLIC_SITE_ID"),
  RUNTIME_CMS: value("VITE_PUBLIC_ENABLE_RUNTIME_CMS", "true") === "true",
  CONTACT_URL: value("VITE_PUBLIC_CONTACT_URL", "#newsletter"),
  VIMEO_URL: value("VITE_PUBLIC_VIMEO_URL", "#newsletter"),
  INSTAGRAM_URL: value("VITE_PUBLIC_INSTAGRAM_URL", "#newsletter"),
};
