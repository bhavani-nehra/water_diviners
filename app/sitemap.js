import { SERVICES, LOCATIONS, SITE } from "@/lib/seoData";

export default function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = "monthly") => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/faq", 0.7),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...LOCATIONS.map((l) => page(`/locations/${l.slug}`, l.slug === "kankavli" ? 0.9 : 0.7)),
  ];
}
