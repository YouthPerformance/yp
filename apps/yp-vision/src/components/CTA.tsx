"use client";

import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, FileText, Mail } from "lucide-react";
import { useState } from "react";
import { CONTACT } from "@/lib/constants";

export function CTA() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(CONTACT.email);
    setCopied(true);

    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section bg-gradient-to-b from-wolf-black via-wolf-dark to-wolf-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wolf-neon/5 rounded-full blur-[150px]" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-wolf-neon font-mono text-sm tracking-[0.3em] uppercase mb-6">
            Series A
          </p>

          <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-[0.95]">
            JOIN THE
            <br />
            <span className="text-glow text-wolf-neon">PACK</span>
          </h2>

          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Elite training for every kid, everywhere.
            <br />
            We&apos;re raising to scale the machine.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={handleCopyEmail}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg
                transition-all duration-300
                ${
                  copied
                    ? "bg-wolf-neon text-black"
                    : "bg-wolf-neon/10 text-wolf-neon border border-wolf-neon/30 hover:bg-wolf-neon/20"
                }
              `}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  {CONTACT.email}
                  <Copy className="w-4 h-4 opacity-60" />
                </>
              )}
            </motion.button>

            <motion.a
              href={CONTACT.deckUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-4 rounded-full font-medium text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <FileText className="w-5 h-5" />
              View Full Deck
              <ExternalLink className="w-4 h-4 opacity-60" />
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-0 right-0"
        >
          <div className="flex items-center justify-center gap-8 text-gray-600 text-sm">
            <span>YouthPerformance Inc.</span>
            <span>•</span>
            <span>Austin, TX</span>
            <span>•</span>
            <span>2024</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
