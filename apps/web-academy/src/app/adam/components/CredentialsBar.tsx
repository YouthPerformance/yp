"use client";

import { motion } from "framer-motion";
import { CREDENTIALS } from "../constants";

export function CredentialsBar() {
  return (
    <section className="bg-[#1C2B3A] py-12 px-[60px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center gap-20 flex-wrap"
      >
        {CREDENTIALS.map((cred, i) => (
          <div key={i} className="text-center">
            <p
              className="text-[14px] tracking-[1px] text-[#FAF8F5]"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {cred.org}
            </p>
            <p className="text-[11px] text-[#C5A47E] mt-1 tracking-[1px]">
              {cred.role}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
