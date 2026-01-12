"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useWolfMode } from "../providers/WolfModeProvider";

export function WolfModeToggle() {
  const { isWolfMode, toggleWolfMode } = useWolfMode();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      onClick={toggleWolfMode}
      className={`
        fixed bottom-6 left-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        border transition-all duration-300
        ${
          isWolfMode
            ? "bg-accent-primary border-accent-primary text-bg-secondary shadow-glow-cyan"
            : "bg-bg-elevated border-border-default text-text-secondary hover:border-accent-primary/50"
        }
      `}
      aria-label={isWolfMode ? "Disable Wolf Mode" : "Enable Wolf Mode"}
      title={isWolfMode ? "Wolf Mode: ON" : "Wolf Mode: OFF"}
    >
      <AnimatePresence mode="wait">
        {isWolfMode ? (
          <motion.div
            key="wolf"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring when Wolf Mode is on */}
      {isWolfMode && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-accent-primary"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
