import { getSiteContent } from "@/lib/getSiteContent";
import { telLink, waLink } from "@/lib/contact";
import { SITE } from "@/lib/seoData";
import MapEmbed from "./MapEmbed";
import styles from "./contact.module.css";

export default async function Contact() {
  const f = await getSiteContent("footer");
  const phoneHref = telLink(f.phone);
  const phoneShow = f.phoneDisplay || SITE.phoneDisplay;
  const wa = waLink(f.whatsappHref);
  const mail = f.emailDisplay || SITE.email;

  const tiles = [
    { href: phoneHref, label: "Call", value: phoneShow },
    { href: `tel:${SITE.phone2}`, label: "Call · Updates", value: SITE.phone2Display },
    { href: wa, label: "WhatsApp", value: "Chat with us", ext: true },
    { href: `mailto:${mail}`, label: "Email", value: mail },
  ];

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="contact-title" className={styles.title}>
            Talk to us about your land
          </h2>
          <p className={styles.lead}>
            Tell us your village and plot size. We will tell you what a survey involves and when we can visit.
          </p>
          <ul className={styles.tiles}>
            {tiles.map((t) => (
              <li key={t.label}>
                <a
                  href={t.href}
                  className={styles.tile}
                  {...(t.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className={styles.tileLabel}>{t.label}</span>
                  <span className={styles.tileValue}>{t.value}</span>
                </a>
              </li>
            ))}
          </ul>
          <address className={styles.address}>
            {f.location || "Kankavli, Maharashtra"} {SITE.postalCode}
            <br />
            Serving all of {SITE.district} district
          </address>
        </div>
        <MapEmbed />
      </div>
    </section>
  );
}
