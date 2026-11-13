import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { CtaButtons } from "@/components/seo/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import Faq from "@/components/seo/Faq";
import { SERVICES, LOCATIONS, FAQS, SITE, locationBySlug, faqLd } from "@/lib/seoData";
import styles from "@/styles/seo.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const l = locationBySlug(slug);
  if (!l) return {};
  const title = `Water Diviner & Groundwater Survey in ${l.name}`;
  const description = `Groundwater survey and borewell point marking in ${l.name}, ${SITE.district}. M.M.S Water Diviners, 10+ years experience, 95% success rate. Call ${SITE.phoneDisplay}.`;
  const url = `${SITE.url}/locations/${l.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, type: "article" },
  };
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const l = locationBySlug(slug);
  if (!l) notFound();
  const faqs = FAQS.slice(0, 6);

  return (
    <PageShell crumbs={[{ name: "Locations", path: "/locations/kankavli" }, { name: l.name, path: `/locations/${l.slug}` }]}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.url}/#business`,
          name: SITE.name,
          url: `${SITE.url}/locations/${l.slug}`,
          telephone: SITE.phone,
          areaServed: { "@type": "AdministrativeArea", name: `${l.name}, ${SITE.district}, ${SITE.state}` },
        }}
      />
      <JsonLd data={faqLd(faqs)} />
      <h1 className={styles.h1}>Water Diviner &amp; Groundwater Survey in {l.name}</h1>
      <p className={styles.lead}>{l.blurb}</p>
      <CtaButtons />

      <h2 className={styles.h2}>Groundwater conditions in {l.name}</h2>
      <p className={styles.p}>{l.terrain}</p>
      <p className={styles.p}>
        M.M.S Water Diviners is led by {SITE.owner} and has worked in groundwater scanning and borewell point
        marking for more than 10 years. We visit your plot in {l.name}, scan for water-bearing zones, mark the
        best drilling point and tell you the likely depth and yield.
      </p>

      <h2 className={styles.h2}>Our services in {l.name}</h2>
      <div className={styles.grid}>
        {SERVICES.map((s) => (
          <Link key={s.slug} className={styles.card} href={`/services/${s.slug}`}>
            <div className={styles.cardTitle}>{s.name}</div>
            <div className={styles.cardText}>{s.short}</div>
          </Link>
        ))}
      </div>

      <h2 className={styles.h2}>Also serving nearby areas</h2>
      <div className={styles.chips}>
        {LOCATIONS.filter((o) => o.slug !== l.slug).map((o) => (
          <Link key={o.slug} className={styles.chip} href={`/locations/${o.slug}`}>
            {o.name}
          </Link>
        ))}
      </div>

      <h2 className={styles.h2}>Frequently asked questions</h2>
      <Faq items={faqs} />
    </PageShell>
  );
}
