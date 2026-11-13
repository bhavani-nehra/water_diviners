"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./how.module.css";

// Desktop: section pins and the drill rod goes down one step per scroll beat.
// Mobile / reduced motion: plain list, nothing pinned. All text is always in the HTML.
export default function HowWeWorkStage({ title, steps }) {
  const root = useRef(null);
  const rod = useRef(null);
  const depth = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      let last = -1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${steps.length * 75}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (rod.current) rod.current.style.transform = `translateY(${p * 62}vh)`;
          if (depth.current) depth.current.textContent = String(Math.round(p * 180)).padStart(3, "0");
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          if (idx !== last) {
            last = idx;
            setActive(idx);
          }
        },
      });
      return () => {
        st.kill();
        setPinned(false);
        setActive(0);
      };
    });
    return () => mm.revert();
  }, [steps.length]);

  return (
    <section id="process" ref={root} className={`${styles.how} ${pinned ? styles.pinned : ""}`} aria-labelledby="how-title">
      <div className={styles.inner}>
        <div className={styles.shaft} aria-hidden="true">
          <div ref={rod} className={styles.rod}>
            <span className={styles.rodLine} />
            <span className={styles.bit} />
          </div>
          <div className={styles.depth}>
            <span ref={depth}>000</span> ft
          </div>
        </div>
        <div className={styles.content}>
          <h2 id="how-title" className={styles.title}>
            {title}
          </h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.title} className={`${styles.step} ${!pinned || i === active ? styles.on : ""}`}>
                <h3 className={styles.stepTitle}>
                  <span className={styles.n}>{i + 1}</span>
                  {s.title}
                </h3>
                {s.desc && <p className={styles.desc}>{s.desc}</p>}
                {s.details.length > 0 && (
                  <ul className={styles.details}>
                    {s.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
