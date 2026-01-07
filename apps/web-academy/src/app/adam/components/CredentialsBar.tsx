"use client";

import { motion } from "framer-motion";
import { CREDENTIALS } from "../constants";

export function CredentialsBar() {
  return (
    <section className="py-12 px-[60px] bg-[var(--bg-secondary)] border-y border-[var(--border-default)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center gap-20 flex-wrap"
      >
        {CREDENTIALS.map((cred, i) => (
          <div key={i} className="text-center">
            <p className="font-bebas text-[14px] tracking-[1px] text-[var(--text-primary)]">
              {cred.org}
            </p>
            <p className="text-[11px] text-[var(--accent-primary)] mt-1 tracking-[1px]">
              {cred.role}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
