// ═══════════════════════════════════════════════════════════
// BOTTOM NAVIGATION
// 5-tab navigation bar for main app
// Adapted from yp-academy for barefoot-app styling
// ═══════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { BookOpen, Home, Lock, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  lockedForFree?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/home",
    label: "Home",
    icon: <Home size={22} strokeWidth={1.5} />,
    activeIcon: <Home size={22} strokeWidth={2.5} />,
  },
  {
    href: "/playbook",
    label: "Playbook",
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    activeIcon: <BookOpen size={22} strokeWidth={2.5} />,
    lockedForFree: true,
  },
  {
    href: "/ask-wolf",
    label: "Ask Wolf",
    icon: <WolfIcon />,
    activeIcon: <WolfIcon active />,
    lockedForFree: true,
  },
  {
    href: "/shop",
    label: "Shop",
    icon: <ShoppingBag size={22} strokeWidth={1.5} />,
    activeIcon: <ShoppingBag size={22} strokeWidth={2.5} />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User size={22} strokeWidth={1.5} />,
    activeIcon: <User size={22} strokeWidth={2.5} />,
  },
];

// Custom Wolf Icon for "Ask Wolf" tab
function WolfIcon({ active }: { active?: boolean }) {
  return (
    <div className="relative">
      <span
        className="text-lg leading-none"
        style={{
          filter: active ? "drop-shadow(0 0 8px rgba(0, 246, 224, 0.6))" : undefined,
        }}
      >
        🐺
      </span>
    </div>
  );
}

interface BottomNavProps {
  subscriptionStatus?: "free" | "pro";
  onLockedClick?: () => void;
}

export function BottomNav({ subscriptionStatus = "free", onLockedClick }: BottomNavProps) {
  const pathname = usePathname();

  // Hide nav during workout player
  if (pathname?.includes("/workout/player")) {
    return null;
  }

  const handleClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.lockedForFree && subscriptionStatus === "free") {
      e.preventDefault();
      onLockedClick?.();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border-default)",
      }}
    >
      <div className="max-w-md mx-auto px-2">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/home" && pathname?.startsWith(item.href));
            const isLocked = item.lockedForFree && subscriptionStatus === "free";

            return (
              <Link
                key={item.href}
                href={isLocked ? "#" : item.href}
                onClick={(e) => handleClick(item, e)}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-14 rounded-lg transition-colors"
                style={{
                  color: isActive
                    ? "var(--accent-primary)"
                    : isLocked
                      ? "var(--text-tertiary)"
                      : "var(--text-secondary)",
                }}
              >
                <motion.div whileTap={{ scale: 0.85 }} className="relative">
                  {isActive ? item.activeIcon || item.icon : item.icon}

                  {/* Lock badge for free users */}
                  {isLocked && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <Lock size={8} />
                    </div>
                  )}

                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 -z-10 blur-md rounded-full scale-150"
                      style={{ backgroundColor: "rgba(0, 246, 224, 0.3)" }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>

                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{
                    color: isActive
                      ? "var(--accent-primary)"
                      : isLocked
                        ? "var(--text-tertiary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {item.label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom" style={{ backgroundColor: "var(--bg-primary)" }} />
    </nav>
  );
}

export default BottomNav;
