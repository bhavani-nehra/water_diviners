// components/layout/Navbar.jsx
import { getSiteContent } from "@/lib/getSiteContent";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const c = await getSiteContent("navbar");

  return (
    <NavbarClient
      brandName={c.brandName || "M.M.S"}
      brandTagline={c.brandTagline || "Water Diviners"}
      ctaPhone={c.ctaPhone || "tel:9370427023"}
      ctaLabel={c.ctaLabel || "Call Now"}
    />
  );
}
