import Link from "next/link";
import { getSiteContent } from "@/lib/getSiteContent";
import { telLink, waLink } from "@/lib/contact";
import { SERVICES, LOCATIONS, SITE } from "@/lib/seoData";
import styles from "./footer.module.css";

export default async function Footer() {
  const f = await getSiteContent("footer");
  const year = new Date().getFullYear();
  const phoneShow = f.phoneDisplay || SITE.phoneDisplay;
  const mail = f.emailDisplay || SITE.email;

  return (
    <footer className={styles.footer}>
      {/* Wave cutout: the FAQ's cream dips into the footer */}
      <svg className={styles.wave} viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C300,80 900,0 1200,40 L1200,0 L0,0 Z" fill="var(--cream)" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.callRow}>
          <p className={styles.callLead}>Ready to find water?</p>
          <a className={styles.callBig} href={telLink(f.phone)}>
            Call {phoneShow}
          </a>
          <div className={styles.callAlt}>
            <a href={`tel:${SITE.phone2}`}>Updates: {SITE.phone2Display}</a>
            <a href={waLink(f.whatsappHref)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${mail}`}>{mail}</a>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.brandName}>{f.brandName || SITE.name}</p>
            <p className={styles.tagline}>{f.brandTagline || "Discovering Water, Sustaining Life"}</p>
            <p className={styles.desc}>
              {f.description ||
                "Professional geophysical groundwater survey and borewell point marking in Sindhudurg, Maharashtra."}
            </p>
            <p className={styles.addr}>
              {f.location || "Kankavli, Maharashtra"} {SITE.postalCode}
            </p>
          </div>

          <nav aria-label="Services">
            <p className={styles.colTitle}>Services</p>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Areas we serve">
            <p className={styles.colTitle}>Areas we serve</p>
            <ul>
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/locations/${l.slug}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <p className={styles.colTitle}>Site</p>
            <ul>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/#process">How we work</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bar}>
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p>
            Owned and operated by <strong>{f.copyrightOwner || SITE.owner}</strong>, Kankavli, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
