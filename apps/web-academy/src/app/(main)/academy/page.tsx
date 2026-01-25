// ═══════════════════════════════════════════════════════════
// ACADEMY PORTAL PAGE
// Main entry point for logged-in users
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";

// Program cards data
const PROGRAMS = [
  {
    slug: "barefoot-reset",
    name: "Barefoot Reset",
    expert: "James Scott",
    duration: "42 days",
    description: "Build a bulletproof foundation from the ground up",
    icon: "🦶",
    href: "/programs/barefoot-reset",
  },
  {
    slug: "foundation",
    name: "Foundation",
    expert: "Adam Harrington",
    duration: "42 days",
    description: "Basketball fundamentals for youth athletes",
    icon: "🏀",
    href: "/programs",
  },
];

// Quick action links
const QUICK_ACTIONS = [
  {
    label: "Today's Workout",
    href: "/home",
    icon: "🎯",
    color: "#00F6E0",
  },
  {
    label: "Playbook",
    href: "/playbook",
    icon: "📚",
    color: "#FFD700",
  },
  {
    label: "Drills",
    href: "/drills/basketball",
    icon: "⚡",
    color: "#9B30FF",
  },
  {
    label: "Ask Wolf",
    href: "/ask-wolf",
    icon: "🐺",
    color: "#10B981",
  },
];

export default function AcademyPortal() {
  const { user, isLoaded } = useUserContext();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-4xl block">🐺</span>
        <div className="relative w-10 h-10">
          <div
            className="absolute inset-0 border-2 rounded-full"
            style={{ borderColor: "var(--accent-primary)", opacity: 0.2 }}
          />
          <div
            className="absolute inset-0 border-2 border-transparent rounded-full animate-spin"
            style={{ borderTopColor: "var(--accent-primary)" }}
          />
        </div>
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-loading)",
            color: "var(--text-tertiary)",
          }}
        >
          Loading Academy
        </span>
      </div>
    );
  }

  const userName = user?.name || "Athlete";

  return (
    <main className="p-4 max-w-lg mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="font-bebas text-3xl tracking-wider mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          WELCOME BACK, {userName.toUpperCase()}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Your training headquarters
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2
          className="font-bebas text-lg tracking-wider mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, idx) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <span className="text-2xl">{action.icon}</span>
              <span
                className="text-[10px] text-center font-medium tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Programs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2
          className="font-bebas text-lg tracking-wider mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          TRAINING PROGRAMS
        </h2>
        <div className="space-y-3">
          {PROGRAMS.map((program) => (
            <Link
              key={program.slug}
              href={program.href}
              className="block rounded-2xl p-4 transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{program.icon}</span>
                <div className="flex-1">
                  <h3
                    className="font-bebas text-xl tracking-wider"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {program.name}
                  </h3>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    with {program.expert} • {program.duration}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {program.description}
                  </p>
                </div>
                <div
                  className="text-2xl"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Resources */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2
          className="font-bebas text-lg tracking-wider mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          RESOURCES
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/drills/basketball"
            className="rounded-xl p-4 transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="text-2xl mb-2 block">🏀</span>
            <h3
              className="font-bebas tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              BASKETBALL DRILLS
            </h3>
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Free drill library
            </p>
          </Link>
          <Link
            href="/playbook"
            className="rounded-xl p-4 transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="text-2xl mb-2 block">📖</span>
            <h3
              className="font-bebas tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              PLAYBOOK
            </h3>
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Training guides
            </p>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
