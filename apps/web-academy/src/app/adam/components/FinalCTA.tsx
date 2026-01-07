"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { FINAL_CTA, NAV } from "../constants";

// Simple X/Twitter icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FinalCTA() {
  return (
    <section className="py-24 px-[60px] bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-[700px] mx-auto text-center"
      >
        {/* Section Label */}
        <p className="text-[11px] tracking-[4px] text-[var(--accent-primary)] uppercase mb-4">
          {FINAL_CTA.label}
        </p>

        {/* Title */}
        <h2 className="font-bebas text-[var(--text-primary)] text-[42px] mb-6">
          {FINAL_CTA.title}
        </h2>

        {/* Body */}
        <p className="text-[17px] leading-[1.8] text-[var(--text-secondary)] mb-10 max-w-[560px] mx-auto">
          {FINAL_CTA.body}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={FINAL_CTA.primaryCTA.href}
            className="btn-primary text-sm tracking-wider"
          >
            {FINAL_CTA.primaryCTA.label}
          </Link>
          <Link
            href={FINAL_CTA.secondaryCTA.href}
            className="btn-secondary text-sm tracking-wider"
          >
            {FINAL_CTA.secondaryCTA.label}
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={FINAL_CTA.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <span className="text-[var(--border-default)]">|</span>
          <a
            href={FINAL_CTA.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-[var(--border-default)]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bebas text-[14px] tracking-[2px] text-[var(--text-primary)] no-underline"
          >
            YOUTH<span className="text-[var(--accent-primary)]">PERFORMANCE</span>
          </Link>

          {/* Copyright */}
          <p className="text-[12px] text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} YouthPerformance. All rights
            reserved.
          </p>

          {/* Links */}
          <div className="flex gap-6">
            {NAV.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] no-underline transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </section>
  );
}
