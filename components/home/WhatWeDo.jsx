import Link from "next/link";
import { getSiteContent } from "@/lib/getSiteContent";
import { SERVICES } from "@/lib/seoData";
import styles from "./what.module.css";

export default async function WhatWeDo() {
  const c = await getSiteContent("services");
  const cards = SERVICES.map((s, i) => {
    const n = i + 1;
    return {
      slug: s.slug,
      title: c[`service${n}Title`] || s.name,
      desc: c[`service${n}Desc`] || s.short,
      features: [1, 2, 3, 4].map((f) => c[`service${n}Feature${f}`]).filter(Boolean),
    };
  });

  return (
    <section id="services" className={styles.what} aria-labelledby="what-title">
      <div className={styles.inner}>
        <h2 id="what-title" className={styles.title}>
          {c.sectionTitle || "What we do"}
        </h2>
        <p className={styles.lead}>
          {c.sectionSubtitle || "Every step from scanning your land to marking the borewell point."}
        </p>

        <div className={styles.grid}>
          {cards.map((s, i) => (
            <article key={s.slug} className={`${styles.card} ${i === 0 ? styles.first : ""}`}>
              <h3 className={styles.cardTitle}>
                <Link href={`/services/${s.slug}`}>{s.title}</Link>
              </h3>
              <p className={styles.desc}>{s.desc}</p>
              {s.features.length > 0 && (
                <ul className={styles.chips}>
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
              <Link className={styles.more} href={`/services/${s.slug}`} aria-label={`Read more about ${s.title}`}>
                Read more
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.cta}>
          <div>
            <h3>{c.ctaTitle || "Not sure what you need?"}</h3>
            <p>{c.ctaText || "Tell us about your land and we will suggest the right survey."}</p>
          </div>
          <a href="#contact" className={styles.ctaBtn}>
            {c.ctaButtonLabel || "Get in touch"}
          </a>
        </div>
      </div>
    </section>
  );
}
