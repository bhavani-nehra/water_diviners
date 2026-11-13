import PageShell, { CtaButtons } from "@/components/seo/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import Faq from "@/components/seo/Faq";
import { SITE, FAQS, faqLd } from "@/lib/seoData";
import styles from "@/styles/seo.module.css";

const title = "Borewell & Groundwater Survey FAQ";
const description =
  "Answers to common questions about groundwater survey, borewell point marking, depth, cost and failed borewells in Kankavli and Sindhudurg.";

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/faq` },
  openGraph: { url: `${SITE.url}/faq`, title, description },
};

export default function FaqPage() {
  return (
    <PageShell crumbs={[{ name: "FAQ", path: "/faq" }]}>
      <JsonLd data={faqLd()} />
      <h1 className={styles.h1}>Borewell &amp; Groundwater Survey: Frequently Asked Questions</h1>
      <p className={styles.lead}>
        Straight answers about finding water, marking a borewell point and what to expect from a survey.
      </p>
      <Faq />
      <CtaButtons />
    </PageShell>
  );
}
