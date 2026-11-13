"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGallery, cdn } from "./useGallery";
import styles from "./gallery.module.css";

const pad = (n) => String(n).padStart(2, "0");

export default function GalleryCarousel() {
  const items = useGallery("image");
  const track = useRef(null);
  const tip = useRef(null);
  const dialog = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    [...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, measure]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  if (!items.length) return null;

  const goTo = (i) => {
    const el = track.current;
    const c = el?.children[Math.max(0, Math.min(items.length - 1, i))];
    if (c) el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    if (e.pointerType === "mouse" && tip.current) {
      const r = track.current.getBoundingClientRect();
      tip.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    }
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      track.current.style.scrollSnapType = "none";
      track.current.setPointerCapture(e.pointerId);
    }
    if (d.moved) track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    track.current.style.scrollSnapType = "";
    setTimeout(() => (drag.current.moved = false), 0);
  };

  const step = (dir) => setOpen((i) => (i + dir + items.length) % items.length);
  const few = items.length < 3;

  return (
    <section id="gallery" className={styles.section} aria-labelledby="gallery-title">
      <div className={styles.head}>
        <div>
          <h2 id="gallery-title" className={styles.title}>
            Our work on the ground
          </h2>
          <p className={styles.lead}>Sites, rigs and results from across Sindhudurg.</p>
        </div>
        {!few && (
          <div className={styles.controls}>
            <span className={styles.count} aria-live="polite">
              {pad(active + 1)} <i>/</i> {pad(items.length)}
            </span>
            <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous photo" disabled={active === 0}>
              ←
            </button>
            <button type="button" onClick={() => goTo(active + 1)} aria-label="Next photo" disabled={active === items.length - 1}>
              →
            </button>
          </div>
        )}
      </div>

      <div className={styles.stage}>
        <div
          ref={track}
          className={`${styles.track} ${few ? styles.few : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          tabIndex={0}
          role="region"
          aria-label="Photo carousel, scroll sideways"
        >
          {items.map((it, i) => (
            <figure key={it._id || it.url} className={`${styles.card} ${i === active ? styles.on : ""}`}>
              <button
                type="button"
                className={styles.arch}
                onClick={() => !drag.current.moved && setOpen(i)}
                aria-label={`Open photo ${i + 1}${it.caption ? `: ${it.caption}` : ""}`}
              >
                <img
                  src={cdn(it.url, "f_auto,q_auto,w_900")}
                  alt={it.caption || "Groundwater survey work in Sindhudurg"}
                  loading={i < 3 ? "eager" : "lazy"}
                  draggable="false"
                />
              </button>
              <figcaption className={styles.cap}>
                <span>{pad(i + 1)}</span>
                {it.caption || "On site, Sindhudurg"}
              </figcaption>
            </figure>
          ))}
        </div>
        <span ref={tip} className={styles.tip} aria-hidden="true">
          Drag
        </span>
      </div>

      {!few && (
        <div className={styles.bar} aria-hidden="true">
          <span style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
      )}

      <dialog
        ref={dialog}
        className={styles.dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label="Photo viewer"
      >
        {open !== null && items[open] && (
          <figure className={styles.fig}>
            <img src={cdn(items[open].url, "f_auto,q_auto,w_1800")} alt={items[open].caption || "Groundwater survey work in Sindhudurg"} />
            {items[open].caption && <figcaption>{items[open].caption}</figcaption>}
          </figure>
        )}
        <button type="button" className={styles.close} onClick={() => setOpen(null)} aria-label="Close viewer" autoFocus>
          ×
        </button>
        {items.length > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Previous photo">
              ←
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label="Next photo">
              →
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
