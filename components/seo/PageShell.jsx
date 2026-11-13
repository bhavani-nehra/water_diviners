import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import JsonLd from "./JsonLd";
import { breadcrumbLd, SITE } from "@/lib/seoData";
import styles from "@/styles/seo.module.css";

export default function PageShell({ crumbs, children }) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <JsonLd data={breadcrumbLd(all)} />
        <div className={styles.wrap}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            {all.map((c, i) => (
              <span key={c.path}>
                {i > 0 && " › "}
                {i < all.length - 1 ? <Link href={c.path}>{c.name}</Link> : c.name}
              </span>
            ))}
          </nav>
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
}

export function CtaButtons() {
  return (
    <div className={styles.cta}>
      <a className={styles.btn} href={`tel:${SITE.phone}`}>
        Call {SITE.phoneDisplay}
      </a>
      <a className={`${styles.btn} ${styles.btnAlt}`} href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
        WhatsApp us
      </a>
    </div>
  );
}
