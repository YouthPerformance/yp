// ═══════════════════════════════════════════════════════════
// ASK YP MODAL - Full-screen AI search interface
// Morphs from FAB, shows results inline
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronRight } from "lucide-react";
import { WolfIcon } from "./WolfIcon";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface AskYPModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface SearchResult {
  type: "pillar" | "drill" | "tool";
  title: string;
  subtitle: string;
  icon: string;
  href?: string;
}

type Status = "idle" | "processing" | "success" | "error";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const CHIPS = [
  "quiet",
  "no hoop",
  "fix shot",
  "ankle",
  "ACL safe",
  "10 min",
  "shooting mechanics",
  "barefoot",
];

const RECENT_PILLARS = [
  { name: "Silent Training", count: 12 },
  { name: "Shooting Mechanics", count: 8 },
  { name: "Barefoot Training", count: 15 },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function AskYPModal({ isOpen, onClose, initialQuery = "" }: AskYPModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setResults([]);
      if (initialQuery) {
        setQuery(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Submit handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!query.trim()) return;

      setStatus("processing");

      try {
        // Call the answer engine API
        const response = await fetch(
          `/api/answer-engine/answer?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        // Transform API response to SearchResult format
        const searchResults: SearchResult[] = [];

        // Add pillar if matched
        if (data.pillar) {
          searchResults.push({
            type: "pillar",
            title: data.pillar.title || data.pillar.slug,
            subtitle: `${data.pillar.expert} • ${data.pillar.drillCount || 0} drills`,
            icon: "📍",
            href: `/basketball/${data.pillar.slug}`,
          });
        }

        // Add drills
        if (data.drills?.length) {
          data.drills.slice(0, 5).forEach((drill: any) => {
            searchResults.push({
              type: "drill",
              title: drill.title || drill.name,
              subtitle: `${drill.duration || "5 min"} • ${drill.difficulty || "Beginner"} • ${drill.expert || "Adam"}`,
              icon: "🏀",
              href: drill.href,
            });
          });
        }

        // Add tools if matched
        if (data.tools?.length) {
          data.tools.forEach((tool: any) => {
            searchResults.push({
              type: "tool",
              title: tool.title,
              subtitle: tool.description,
              icon: "⚡",
              href: tool.href,
            });
          });
        }

        setResults(searchResults);
        setStatus("success");
      } catch (err) {
        console.error("Search error:", err);
        // Fallback to mock results for demo
        setResults([
          {
            type: "pillar",
            title: "Silent Training",
            subtitle: "Quiet skill work • Adam Harrington",
            icon: "🔇",
            href: "/basketball/silent-training",
          },
          {
            type: "drill",
            title: "Stationary Pound Series",
            subtitle: "5 min • Beginner • Adam",
            icon: "🏀",
          },
          {
            type: "drill",
            title: "Figure-8 Wraps",
            subtitle: "3 min • Beginner • Adam",
            icon: "⚡",
          },
        ]);
        setStatus("success");
      }
    },
    [query]
  );

  // Chip click handler
  const handleChipClick = (chip: string) => {
    setQuery(chip);
    // Auto-submit after a short delay for better UX
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
            <motion.div
              layoutId="ask-yp-container"
              className="w-full md:max-w-lg bg-[#0D0D0D]/95 backdrop-blur-3xl border-t md:border border-white/10 md:rounded-3xl rounded-t-3xl shadow-[0_0_120px_rgba(0,246,224,0.05)] overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
              {/* Drag handle (mobile) */}
              <div className="md:hidden flex justify-center pt-3">
                <div className="w-9 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="p-6 md:p-8 min-h-[400px] max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={onClose}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Wolf Animation */}
                <div className="flex justify-center">
                  <WolfIcon state={status === "processing" ? "processing" : status === "success" ? "success" : "idle"} />
                </div>

                {/* Title */}
                <motion.h3
                  className="text-xl md:text-2xl font-medium text-center text-white mb-6 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {status === "processing"
                    ? "Thinking..."
                    : status === "success"
                      ? "Here's what I found:"
                      : "What do you want to train?"}
                </motion.h3>

                {/* Input Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="relative mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="quiet basketball drills..."
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-4 pr-14 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F6E0] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={status === "processing"}
                    className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-[#00F6E0] text-black rounded-lg hover:bg-[#00DCCE] transition-colors disabled:opacity-50"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.form>

                {/* Content - scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {status === "idle" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* Chips */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {CHIPS.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleChipClick(chip)}
                            className="px-3 py-1.5 text-sm text-zinc-400 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:text-[#00F6E0] hover:border-[#00F6E0]/30 transition-all"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Recent Pillars */}
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-xs font-mono text-zinc-500 mb-3 uppercase tracking-wider">
                          Recent from Pillars
                        </p>
                        <div className="space-y-3">
                          {RECENT_PILLARS.map((pillar) => (
                            <button
                              key={pillar.name}
                              onClick={() => handleChipClick(pillar.name)}
                              className="flex items-center gap-3 text-sm text-zinc-300 hover:text-[#00F6E0] cursor-pointer group w-full text-left"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#00F6E0] transition-colors" />
                              {pillar.name}
                              <span className="text-zinc-600">
                                → {pillar.count} drills
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {status === "success" && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="text-xs font-mono text-[#00F6E0] mb-2 uppercase tracking-wider">
                        Top Match
                      </div>

                      {results.map((result, i) => (
                        <motion.a
                          key={i}
                          href={result.href || "#"}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group flex items-center gap-4 p-4 bg-[#141414] border border-white/5 rounded-xl hover:border-[#00F6E0]/30 transition-all cursor-pointer block"
                        >
                          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-xl border border-white/5 group-hover:border-[#00F6E0]/20 flex-shrink-0">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#00F6E0] transition-colors truncate">
                              {result.title}
                            </h4>
                            <p className="text-xs text-zinc-500 truncate">
                              {result.subtitle}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white flex-shrink-0" />
                        </motion.a>
                      ))}

                      {/* Suggestion */}
                      <div className="mt-6 p-3 rounded-xl bg-[#00F6E0]/5 border border-[#00F6E0]/10">
                        <p className="text-sm text-[#00F6E0]">
                          💬 Try adding "no bounce" for even quieter options
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Hint */}
                <div className="mt-6 text-center pt-4 border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 font-mono">
                    {status === "idle" ? "⌘K TO OPEN ANYTIME" : "AI-CITED RESULTS"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
