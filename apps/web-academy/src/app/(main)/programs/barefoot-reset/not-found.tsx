"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function BarefootResetNotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 404 Visual */}
        <div className="text-6xl mb-4">🐺❓</div>

        {/* Title */}
        <h1 className="font-bebas text-4xl text-white mb-2">
          SIGNAL LOST
        </h1>

        <p className="font-bebas text-6xl text-cyan-500 mb-4">404</p>

        {/* Message */}
        <p className="text-gray-400 mb-8">
          The mission you're looking for doesn't exist in the Wolf Den.
          It may have been moved or the coordinates are incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/programs/barefoot-reset"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 text-black font-bold"
          >
            <Home className="w-5 h-5" />
            RETURN TO DEN
          </Link>

          <Link
            href="/programs"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 text-white font-medium"
          >
            <Search className="w-5 h-5" />
            BROWSE ALL PROGRAMS
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
