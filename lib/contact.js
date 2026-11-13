// CMS stores wa.me links without a country code (https://wa.me/9370427023), which WhatsApp rejects.
export function waLink(href, fallbackNumber = "919370427023") {
  const base = "https://wa.me/";
  if (!href) return base + fallbackNumber;
  const m = href.match(/wa\.me\/(\d+)/);
  if (m && m[1].length === 10) return href.replace(m[1], "91" + m[1]);
  return href;
}

export function telLink(href, fallback = "tel:9370427023") {
  const v = href || fallback;
  return v.startsWith("tel:") ? v : `tel:${v}`;
}
