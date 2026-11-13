import { getSiteContent } from "@/lib/getSiteContent";
import CountUp from "./CountUp";
import styles from "./about.module.css";

export default async function About() {
  const [j, st, hero] = await Promise.all([
    getSiteContent("journey"),
    getSiteContent("stats"),
    getSiteContent("hero"),
  ]);

  const steps = [1, 2, 3, 4, 5]
    .map((n) => ({
      title: j[`step${n}Title`],
      subtitle: j[`step${n}Subtitle`],
      desc: j[`step${n}Desc`],
    }))
    .filter((s) => s.title);

  const stats = [
    { n: st.experienceTarget || "10", suffix: "+", label: st.experienceLabel || "Years experience" },
    { n: st.successTarget || "95", suffix: "%", label: st.successLabel || "Success rate" },
    { n: st.clientsTarget || "350", suffix: "+", label: st.clientsLabel || "Happy clients" },
    { n: st.projectsTarget || "20", suffix: "+", label: st.projectsLabel || "Successful projects" },
  ];

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <svg className={styles.wave} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 H1440 V28 C1130,98 760,-22 0,64 Z" fill="var(--deep)" />
      </svg>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 id="about-title" className={styles.title}>
            {j.sectionTitle || "Our journey with you"}
          </h2>
          <p className={styles.lead}>
            {j.sectionSubtitle ||
              "From first call to water found, here is how we work with you."}
          </p>
          <div className={styles.owner}>
            <p className={styles.ownerName}>{hero.expertName || "Dhananjay Manohar Sawant"}</p>
            <p className={styles.ownerRole}>
              {hero.expertTitle || "Geophysical Water Survey Expert"}, Kankavli
            </p>
          </div>
          <dl className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt>{s.label}</dt>
                <dd>
                  <CountUp value={s.n} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                {s.subtitle && <p className={styles.stepSub}>{s.subtitle}</p>}
                {s.desc && <p className={styles.stepDesc}>{s.desc}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
