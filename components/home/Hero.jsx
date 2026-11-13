import { telLink, waLink } from "@/lib/contact";
import HeroArt from "./HeroArt";
import HeroScene from "./HeroScene";
import styles from "./hero.module.css";

const LINES = ["We find the water", "under your land."];

export default function Hero({ c = {}, stats = {} }) {
  const callHref = telLink(c.ctaCallPhone);
  const waHref = waLink(c.ctaWhatsappHref);
  const nums = [
    { n: stats.experienceTarget || "10", s: "+", l: stats.experienceLabel || "Years experience" },
    { n: stats.successTarget || "95", s: "%", l: stats.successLabel || "Success rate" },
    { n: stats.clientsTarget || "350", s: "+", l: stats.clientsLabel || "Happy clients" },
  ];

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.visual}>
        <HeroArt />
        <HeroScene callHref={callHref} waHref={waHref} />
      </div>

      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          {LINES.map((line, li) => (
            <span key={li} className={`${styles.line} ${li === 1 ? styles.lineTwo : ""}`}>
              {line.split(" ").map((w, i) => (
                <span key={i} className={styles.word}>
                  <span className={styles.wordInner} data-word>
                    {w}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className={styles.sub} data-hero-fade>
          Groundwater survey and borewell point marking across Sindhudurg. We scan your land and mark
          the spot before you drill.
        </p>
        <div className={styles.ctas} data-hero-fade>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href={callHref}>
            {c.ctaCallLabel || "Call now"}
          </a>
          <a className={`${styles.btn} ${styles.btnGhost}`} href={waHref} target="_blank" rel="noopener noreferrer">
            {c.ctaWhatsappLabel || "WhatsApp"}
          </a>
        </div>
        <dl className={styles.stats} data-hero-fade>
          {nums.map((x) => (
            <div key={x.l}>
              <dt>{x.l}</dt>
              <dd>
                {x.n}
                {x.s}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
