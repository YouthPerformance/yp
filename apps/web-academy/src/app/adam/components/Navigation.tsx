"use client";

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
        isScrolled
          ? "bg-bg-secondary/90 backdrop-blur-md border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <span className="font-bebas text-xl tracking-wider text-text-primary hover:text-accent-primary transition-colors">
            {NAV.logo}
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[2px] uppercase text-text-secondary hover:text-accent-primary transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}

          {/* CTA Button */}
          <Link
            href={NAV.cta.href}
            className="ml-4 px-5 py-2.5 bg-accent-primary text-bg-secondary text-xs tracking-wider uppercase font-bold hover:shadow-glow-cyan transition-all"
          >
            {NAV.cta.label}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-text-secondary hover:text-accent-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
