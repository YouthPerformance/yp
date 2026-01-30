// ═══════════════════════════════════════════════════════════
// ASK YP FAB - Floating Action Button
// Smart visibility based on hero scroll position
// Morphs to modal via shared layoutId
// ═══════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AskYPFabProps {
  visible: boolean;
  onClick: () => void;
}

export function AskYPFab({ visible, onClick }: AskYPFabProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          layoutId="ask-yp-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center gap-3 px-5 py-3 bg-[#0D0D0D]/90 backdrop-blur-xl border border-[#00F6E0]/20 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,246,224,0.1)] group cursor-pointer hover:border-[#00F6E0]/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(0,246,224,0.15)] transition-all"
        >
          <Sparkles className="w-5 h-5 text-[#00F6E0]" />
          <span className="hidden md:block text-sm font-medium text-white">
            Ask YP
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
