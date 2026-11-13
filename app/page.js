import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import Contact from "@/components/home/Contact";
import EmailCta from "@/components/home/EmailCta";
import Faq from "@/components/home/Faq";
import Hero from "@/components/home/Hero";
import WhoWeAre from "@/components/home/WhoWeAre";
import WhatWeDo from "@/components/home/WhatWeDo";
import HowWeWork from "@/components/home/HowWeWork";
import { getSiteContent } from "@/lib/getSiteContent";
import Loader from "@/components/home/Loader";
import About from "@/components/home/About";
import GalleryCarousel from "@/components/home/GalleryCarousel";
import VideoSection from "@/components/home/VideoSection";
import SmoothScroll from "@/components/home/SmoothScroll";
import styles from "./page.module.css";
import ReviewsSection from "@/components/sections/ReviewsSections";

export const metadata = {
  title: "M.M.S Water Diviners | Groundwater Survey Expert Kankavli",
  description:
    "M.M.S Water Diviners in Kankavli — expert groundwater scanning, borewell marking & depth estimation. 10+ years, 95% success rate. Call 9370427023.",
  alternates: { canonical: "https://mmswaterdiviners.in" },
  openGraph: { url: "https://mmswaterdiviners.in" },
};

export default async function Home() {
  const [heroC, statsC] = await Promise.all([getSiteContent("hero"), getSiteContent("stats")]);

  return (
    <SmoothScroll>
      <Loader />
      <main className={styles.main}>
      <Navbar />
      <Hero c={heroC} stats={statsC} />
      <About />
      <GalleryCarousel />
      <VideoSection />
      <WhoWeAre />
      <WhatWeDo />
      <HowWeWork />
      <Contact />
      <ReviewsSection />
      <EmailCta />
      <Faq />
      <Footer />
    </main>
    </SmoothScroll>
  );
}
