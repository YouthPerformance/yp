// ═══════════════════════════════════════════════════════════
// ASK YP HERO - Hero-embedded search input
// Glassmorphism card with chips
// ═══════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { WolfIcon } from "./WolfIcon";

interface AskYPHeroProps {
  onSearch: (query: string) => void;
  onFocus?: () => void;
}

const CHIPS = [
  "quiet",
  "no hoop",
  "fix shot",
  "ankle",
  "ACL safe",
  "10 min",
];

export function AskYPHero({ onSearch, onFocus }: AskYPHeroProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    onSearch(chip);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Glassmorphism container */}
      <div
        className={`relative bg-[#0D0D0D]/70 backdrop-blur-xl rounded-3xl border transition-all duration-300 ${
          isFocused
            ? "border-[#00F6E0]/30 shadow-[0_0_40px_rgba(0,246,224,0.1)]"
            : "border-white/10"
        }`}
      >
        <div className="p-6 md:p-8">
          {/* Wolf + Title */}
          <div className="flex items-center gap-3 mb-4">
            <WolfIcon state="idle" size="sm" />
            <span className="text-lg text-white font-medium">
              What do you want to train today?
            </span>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="relative mb-4">
            <div
              className={`relative flex items-center bg-[#1A1A1A] border rounded-xl transition-all ${
                isFocused ? "border-[#00F6E0]" : "border-white/10"
              }`}
            >
              <Search className="ml-4 text-zinc-500 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  onFocus?.();
                }}
                onBlur={() => setIsFocused(false)}
                placeholder="quiet basketball drills for my apartment"
                className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none placeholder:text-zinc-600"
              />
              <div className="hidden md:flex items-center gap-1 px-3">
                <kbd className="px-2 py-1 text-xs font-mono text-zinc-500 bg-white/5 rounded border border-white/10">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 text-sm text-zinc-400 bg-white/5 border border-white/5 rounded-full hover:bg-[#00F6E0]/10 hover:text-[#00F6E0] hover:border-[#00F6E0]/30 transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
