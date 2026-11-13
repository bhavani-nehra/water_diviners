"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { displayProgress } from "@/lib/loaderProgress";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import styles from "./loader.module.css";

const MAX_FT = 180;

export default function Loader({ caption = "Reading the ground in Kankavli" }) {
  const [gone, setGone] = useState(false);
  const root = useRef(null);
  const rod = useRef(null);
  const count = useRef(null);
  const flood = useRef(null);
  const finish = useRef(() => {});

  useEffect(() => {
    const html = document.documentElement;
    const reduced = prefersReducedMotion();
    let seen = false;
    try {
      seen = sessionStorage.getItem("mmsIntro") === "1";
    } catch {}
    const minMs = reduced ? 1000 : seen ? 800 : 3000;
    const start = performance.now();
    let fontsReady = false;
    let loaded = document.readyState === "complete";
    let raf = 0;
    let done = false;
    let tl;

    document.fonts?.ready.then(() => (fontsReady = true), () => (fontsReady = true));
    if (!document.fonts) fontsReady = true;
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    const end = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem("mmsIntro", "1");
      } catch {}
      html.dataset.intro = "done";
      window.dispatchEvent(new Event("mms:intro-done"));
      setGone(true);
    };

    const paint = (pct) => {
      const ft = Math.round((pct / 100) * MAX_FT);
      if (count.current) count.current.textContent = String(ft).padStart(3, "0");
      if (rod.current && !reduced)
        rod.current.style.transform = `translateY(${(pct / 100) * 52}vh)`;
    };

    const runFlood = () => {
      if (reduced || !flood.current || !rod.current) {
        gsap.to(root.current, { opacity: 0, duration: DUR.exit, onComplete: end });
        return;
      }
      const tip = rod.current.querySelector("[data-tip]").getBoundingClientRect();
      gsap.set(flood.current, { left: tip.left + tip.width / 2, top: tip.top + tip.height / 2 });
      const reach = (Math.max(window.innerWidth, window.innerHeight) * 2.6) / 20;
      tl = gsap
        .timeline({ onComplete: end })
        .to(flood.current, { scale: reach, duration: DUR.scene, ease: EASE.inOut })
        .to(root.current, { opacity: 0, duration: DUR.exit, ease: EASE.in });
    };

    const tick = (now) => {
      const real = (fontsReady ? 0.5 : 0) + (loaded ? 0.5 : 0);
      const pct = displayProgress(real, now - start, minMs);
      paint(pct);
      if (pct >= 100) return runFlood();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    finish.current = () => {
      cancelAnimationFrame(raf);
      tl?.kill();
      end();
    };
    return () => {
      cancelAnimationFrame(raf);
      tl?.kill();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className={styles.loader} data-loader role="status" aria-live="polite">
      <noscript>
        <style>{`[data-loader]{display:none}`}</style>
      </noscript>
      <div className={styles.strata} aria-hidden="true" />
      <svg className={styles.shaft} viewBox="0 0 220 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <line x1="110" y1="0" x2="110" y2="1000" stroke="rgba(246,241,228,0.12)" strokeWidth="1" strokeDasharray="4 10" />
        <g ref={rod} className={styles.rod}>
          <line x1="110" y1="-1200" x2="110" y2="90" stroke="#F6F1E4" strokeWidth="6" />
          {[-60, -140, -220, -300].map((y) => (
            <rect key={y} x="102" y={y} width="16" height="10" fill="#14181C" stroke="#F6F1E4" strokeWidth="2" />
          ))}
          <path d="M92 90 L128 90 L110 128 Z" fill="#F6F1E4" />
          <circle data-tip cx="110" cy="128" r="3" fill="#8FD0F0" />
        </g>
      </svg>
      <p className={styles.caption}>{caption}</p>
      <div className={styles.counter} aria-label="Depth in feet">
        <span ref={count}>000</span>
        <span className={styles.unit}>ft</span>
      </div>
      <button type="button" className={styles.skip} onClick={() => finish.current()}>
        Skip
      </button>
      <div ref={flood} className={styles.flood} />
    </div>
  );
}
