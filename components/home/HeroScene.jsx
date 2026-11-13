"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { makeCrackSystems, distanceToVeins } from "@/lib/veins";
import { readoutAt } from "@/lib/readout";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";
import { ART, GROUND } from "./HeroArt";
import styles from "./hero.module.css";

const TIER_TEXT = {
  strong: "Strong water signal",
  moderate: "Moderate water signal",
  weak: "Weak signal here. Try nearer a crack.",
};

const REACH = 150; // px: how close the pointer must be to a crack system to light all of it

// Maps the ground box of the illustration into the container, matching preserveAspectRatio="xMaxYMid slice".
function groundRect(W, H) {
  const s = Math.max(W / ART.w, H / ART.h);
  const ox = W - ART.w * s;
  const oy = (H - ART.h * s) / 2;
  return { left: ox + GROUND.x * s, top: oy + GROUND.y * s, w: GROUND.w * s, h: GROUND.h * s };
}

export default function HeroScene({ callHref, waHref }) {
  const root = useRef(null);
  const stage = useRef(null);
  const canvas = useRef(null);
  const [pin, setPin] = useState(null);
  const [box, setBox] = useState({ left: 0, top: 0, w: 0, h: 0, W: 0 });

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const host = root.current.parentElement; // .visual
    const el = stage.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    let w = 1;
    let h = 1;
    let systems = [];
    let layers = []; // one pre-drawn canvas per crack system
    let glow = []; // 0..1 per system
    let all = [];
    let raf = 0;
    let visible = true;

    const build = () => {
      const r = host.getBoundingClientRect();
      const b = groundRect(r.width, r.height);
      setBox({ ...b, W: r.width });
      w = Math.max(1, Math.round(b.w));
      h = Math.max(1, Math.round(b.h));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      systems = makeCrackSystems(7, w, h, 6);
      all = systems.flat();
      glow = systems.map((_, i) => glow[i] || 0);
      layers = systems.map((sys) => {
        const c = document.createElement("canvas");
        c.width = cv.width;
        c.height = cv.height;
        const x = c.getContext("2d");
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
        x.lineJoin = "round";
        x.lineCap = "round";
        x.strokeStyle = "#BFE6F7";
        x.shadowColor = "#8FD0F0";
        x.shadowBlur = 14;
        sys.forEach((poly, pi) => {
          x.lineWidth = pi === 0 ? 2.8 : 1.7;
          x.beginPath();
          poly.forEach((p, j) => (j ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)));
          x.stroke();
        });
        return c;
      });
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      layers.forEach((c, i) => {
        if (!reduced) glow[i] *= 0.985;
        ctx.globalAlpha = Math.min(1, 0.16 + glow[i] * 0.84);
        ctx.drawImage(c, 0, 0);
      });
      ctx.globalAlpha = 1;
    };

    const pt = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const light = (p) => {
      systems.forEach((sys, i) => {
        if (distanceToVeins(sys, p.x, p.y) < REACH) glow[i] = 1;
      });
    };
    const onMove = (e) => light(pt(e));
    const onDown = (e) => {
      if (e.target.closest("[data-card]")) return;
      const p = pt(e);
      light(p);
      setPin({ ...p, ...readoutAt(distanceToVeins(all, p.x, p.y), h, p.y), w, h });
    };

    build();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      build();
      setPin(null);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    });
    io.observe(host);
    raf = requestAnimationFrame(frame);

    // Entrance: headline words rise, then the crack systems flash on in turn, left to right.
    const words = gsap.utils.toArray("[data-word]");
    const fades = gsap.utils.toArray("[data-hero-fade]");
    if (!reduced) {
      gsap.set(words, { yPercent: 110, opacity: 0, filter: "blur(8px)" });
      gsap.set(fades, { y: 24, opacity: 0 });
    }
    let started = false;
    const timers = [];
    const start = () => {
      if (started || reduced) return;
      started = true;
      gsap
        .timeline()
        .to(words, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: DUR.scene, ease: EASE.expo, stagger: 0.07 })
        .to(fades, { y: 0, opacity: 1, duration: DUR.enter, ease: EASE.out, stagger: 0.1 }, "-=0.5");
      systems.forEach((_, i) => timers.push(setTimeout(() => (glow[i] = 1), 900 + i * 220)));
    };
    if (document.documentElement.dataset.intro === "done") start();
    else window.addEventListener("mms:intro-done", start, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("mms:intro-done", start);
    };
  }, []);

  const close = useCallback(() => setPin(null), []);
  useEffect(() => {
    if (!pin) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pin, close]);

  const CARD_W = 270;
  const CARD_H = 235;
  const card = pin && {
    left: Math.max(8, Math.min(box.left + pin.x - CARD_W / 2, box.W - CARD_W - 8)),
    top: Math.max(8, box.top + pin.y - CARD_H - 14),
  };

  return (
    <div ref={root} className={styles.sceneLayer}>
      <p className={styles.hintM}>Move across the ground to light up the cracks. Tap to drop a pin.</p>
      <div className={styles.stageWrap} style={{ left: box.left, top: box.top, width: box.w, height: box.h }}>
        <div ref={stage} className={styles.stage}>
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
          <p className={styles.hint}>Move across the ground to light up the cracks. Tap to drop a pin.</p>
        </div>
      </div>
      {pin && (
        <>
          <span className={styles.pin} style={{ left: box.left + pin.x, top: box.top + pin.y }} aria-hidden="true" />
          <div className={styles.card} style={card} data-card role="dialog" aria-label="Water reading">
            <button type="button" className={styles.close} onClick={close} aria-label="Close reading">
              ×
            </button>
            <div className={styles.cardDepth}>About {pin.depthFt} ft</div>
            <p className={styles.cardTier}>{TIER_TEXT[pin.tier]}</p>
            <p className={styles.cardNote}>Illustration only. A real survey reads your actual land.</p>
            <div className={styles.cardCtas}>
              <a className={styles.cardBtn} href={callHref}>
                Call
              </a>
              <a className={`${styles.cardBtn} ${styles.cardBtnAlt}`} href={waHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
