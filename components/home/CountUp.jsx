"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, prefersReducedMotion } from "@/lib/motion";

// Server renders the final number (SEO, no-JS). In the browser it counts up once when seen.
export default function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const end = parseInt(String(value).replace(/\D/g, ""), 10);
    if (!el || Number.isNaN(end) || prefersReducedMotion()) return;
    el.textContent = "0";
    const obj = { n: 0 };
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        gsap.to(obj, {
          n: end,
          duration: DUR.scene * 2,
          ease: EASE.out,
          onUpdate: () => (el.textContent = String(Math.round(obj.n))),
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <span>
      <span ref={ref}>{String(value).replace(/\D/g, "") || value}</span>
      {suffix}
    </span>
  );
}
