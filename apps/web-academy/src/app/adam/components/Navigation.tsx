"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-[#FAF8F5]/97 backdrop-blur-[12px] border-b border-[rgba(197,164,126,0.15)]"
          : "bg-transparent"
      }`}
      style={{ padding: "20px 48px" }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-display)] text-[14px] tracking-[2px] text-[#1C2B3A] no-underline"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          YOUTH<span className="text-[#C5A47E]">PERFORMANCE</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] tracking-[0.5px] text-[#6B7280] hover:text-[#1C2B3A] transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href={NAV.cta.href}
          className="bg-[#1C2B3A] text-[#FAF8F5] px-6 py-3 text-[12px] tracking-[1px] uppercase no-underline hover:bg-[#2a3d4f] transition-colors"
        >
          {NAV.cta.label}
        </Link>
      </div>
    </nav>
  );
}
