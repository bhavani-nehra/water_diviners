import { getSiteContent } from "@/lib/getSiteContent";
import HowWeWorkStage from "./HowWeWorkStage";

const FALLBACK = ["Site survey", "Geophysical scanning", "Data interpretation", "Report and marking"];

export default async function HowWeWork() {
  const c = await getSiteContent("process");
  const steps = [1, 2, 3, 4].map((n) => ({
    title: c[`step${n}Title`] || FALLBACK[n - 1],
    desc: c[`step${n}Desc`] || "",
    details: [1, 2, 3].map((d) => c[`step${n}Detail${d}`]).filter(Boolean),
  }));
  return <HowWeWorkStage title={c.sectionTitle || "How we work"} steps={steps} />;
}
