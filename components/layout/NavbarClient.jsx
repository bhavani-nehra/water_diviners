"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from "@/styles/navbar.module.css";

export default function NavbarClient({
  brandName,
  brandTagline,
  ctaPhone,
  ctaLabel,
  isAdmin,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#gallery", label: "Gallery" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
    { href: "#faq", label: "FAQ" },
    ...(isAdmin ? [{ href: "/admin/dashboard", label: "⚙️ Admin" }] : []),
  ];

  // Secret: 5 quick taps on the logo icon opens admin login
  const logoTaps = useRef({ count: 0, last: 0 });
  const handleLogoIconClick = (e) => {
    const now = Date.now();
    const t = logoTaps.current;
    t.count = now - t.last < 1500 ? t.count + 1 : 1;
    t.last = now;
    if (t.count >= 3) {
      t.count = 0;
      e.preventDefault();
      router.push("/admin/login");
    }
  };

  const handleNavClick = (e, href) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }

    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon} onClick={handleLogoIconClick}>
            <Image
              src="/logo.jpeg"
              alt="Logo"
              width={100}
              height={60}
              style={{
                width: "auto",
                height: "60px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className={styles.logoText}>
            <span className={styles.brandName}>{brandName}</span>
            <span
              className={styles.brandTagline}
              style={{ contentVisibility: "visible" }}
            >
              {brandTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href={ctaPhone} className={styles.ctaButton}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          {ctaLabel}
        </a>

        {/* Mobile Hamburger */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.mobileNavLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={ctaPhone}
          className={styles.mobileCtaButton}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          {ctaLabel}
        </a>
      </div>
    </nav>
  );
}
