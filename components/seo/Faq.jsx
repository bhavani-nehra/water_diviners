import { FAQS } from "@/lib/seoData";
import styles from "@/styles/seo.module.css";

export default function Faq({ items = FAQS }) {
  return (
    <div className={styles.faq}>
      {items.map((f) => (
        <details key={f.q} className={styles.faqItem}>
          <summary className={styles.faqQ}>{f.q}</summary>
          <p className={styles.faqA}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
