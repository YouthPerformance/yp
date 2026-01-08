"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "../constants";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-[var(--border-default)]" : "bg-transparent"
      }`}
      style={{ padding: "16px 60px" }}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <Image
            src="/logo/yp-logo.png"
            alt="YouthPerformance"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm tracking-wide text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA removed - credibility page */}
      </div>
    </nav>
  );
}
