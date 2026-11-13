import JsonLd from "@/components/seo/JsonLd";
import { FAQS, SITE, faqLd } from "@/lib/seoData";
import styles from "./faq.module.css";

export default function Faq() {
  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <JsonLd data={faqLd()} />
      <div className={styles.inner}>
        <div className={styles.side}>
          <h2 id="faq-title" className={styles.title}>
            Questions we hear most
          </h2>
          <p className={styles.lead}>
            Not here? Call <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a> and ask directly.
          </p>
        </div>
        <div className={styles.list}>
          {FAQS.map((f) => (
            <details key={f.q} className={styles.item}>
              <summary className={styles.q}>{f.q}</summary>
              <p className={styles.a}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
