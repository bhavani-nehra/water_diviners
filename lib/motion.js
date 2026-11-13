export const EASE = {
  out: "power3.out",
  in: "power2.in",
  inOut: "power2.inOut",
  expo: "expo.out",
};
export const DUR = { micro: 0.25, enter: 0.6, scene: 0.9, exit: 0.36 };
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
