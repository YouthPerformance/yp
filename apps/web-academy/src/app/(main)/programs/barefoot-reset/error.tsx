"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function BarefootResetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error("Barefoot Reset Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Wolf worried emoji */}
        <div className="text-5xl mb-4">🐺💢</div>

        {/* Title */}
        <h1 className="font-bebas text-3xl text-white mb-2">
          SYSTEM MALFUNCTION
        </h1>

        {/* Message */}
        <p className="text-gray-400 mb-6">
          Something went wrong in The Den. Your Wolf is working on it.
        </p>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 text-black font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            TRY AGAIN
          </button>

          <Link
            href="/programs/barefoot-reset"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 text-white font-medium"
          >
            <Home className="w-5 h-5" />
            RETURN TO DEN
          </Link>
        </div>

        {/* Support link */}
        <p className="text-xs text-gray-500 mt-6">
          Problem persists?{" "}
          <a href="mailto:support@youngplayer.com" className="text-cyan-400 underline">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
