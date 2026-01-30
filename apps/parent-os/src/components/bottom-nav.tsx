"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Car, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Today" },
  { href: "/calendar", icon: Calendar, label: "Pack" },
  { href: "/carpool", icon: Car, label: "Carpool" },
  { href: "/fees", icon: DollarSign, label: "Fees" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
                isActive
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
