import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { CtaButtons } from "@/components/seo/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import Faq from "@/components/seo/Faq";
import { SERVICES, LOCATIONS, FAQS, SITE, serviceBySlug, serviceLd, faqLd } from "@/lib/seoData";
import styles from "@/styles/seo.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  const url = `${SITE.url}/services/${s.slug}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: url },
    openGraph: { url, title: s.title, description: s.description, type: "article" },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const faqs = FAQS.slice(0, 6);

  return (
    <PageShell crumbs={[{ name: "Services", path: "/#services" }, { name: s.name, path: `/services/${s.slug}` }]}>
      <JsonLd data={serviceLd(s)} />
      <JsonLd data={faqLd(faqs)} />
      <h1 className={styles.h1}>{s.title}</h1>
      <p className={styles.lead}>{s.intro}</p>
      <CtaButtons />
      {s.sections.map((sec) => (
        <section key={sec.h}>
          <h2 className={styles.h2}>{sec.h}</h2>
          <p className={styles.p}>{sec.p}</p>
        </section>
      ))}

      <h2 className={styles.h2}>Areas we serve</h2>
      <div className={styles.chips}>
        {LOCATIONS.map((l) => (
          <Link key={l.slug} className={styles.chip} href={`/locations/${l.slug}`}>
            {l.name}
          </Link>
        ))}
      </div>

      <h2 className={styles.h2}>Other services</h2>
      <div className={styles.grid}>
        {SERVICES.filter((o) => o.slug !== s.slug).map((o) => (
          <Link key={o.slug} className={styles.card} href={`/services/${o.slug}`}>
            <div className={styles.cardTitle}>{o.name}</div>
            <div className={styles.cardText}>{o.short}</div>
          </Link>
        ))}
      </div>

      <h2 className={styles.h2}>Frequently asked questions</h2>
      <Faq items={faqs} />
      <p className={styles.p}>
        More answers on our <Link href="/faq" style={{ color: "var(--color-primary)" }}>FAQ page</Link>.
      </p>
    </PageShell>
  );
}
