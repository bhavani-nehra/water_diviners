import { getSiteContent } from "@/lib/getSiteContent";
import { SITE } from "@/lib/seoData";
import styles from "./who.module.css";

const PRINCIPLES = [
  {
    h: "Survey first, drill second",
    p: "A borewell is a big spend and a dry hole is a total loss. We read the land before anyone starts the rig.",
  },
  {
    h: "We know this ground",
    p: `Based in ${SITE.city}, we work in the laterite and hard basalt of ${SITE.district}, where water hides in cracks, not in a layer.`,
  },
  {
    h: "Plain answers",
    p: "You get a marked point, an expected depth and honest advice, in simple words you can share with your driller.",
  },
];

export default async function WhoWeAre() {
  const hero = await getSiteContent("hero");
  return (
    <section id="who" className={styles.who} aria-labelledby="who-title">
      <div className={styles.inner}>
        <div>
          <h2 id="who-title" className={styles.statement}>
            We don&apos;t guess. We read the ground.
          </h2>
          <p className={styles.tag}>{hero.tagline || "Discovering Water, Sustaining Life"}</p>
        </div>
        <ul className={styles.list}>
          {PRINCIPLES.map((x) => (
            <li key={x.h}>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
