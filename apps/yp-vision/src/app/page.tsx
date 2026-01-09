"use client";

import dynamic from "next/dynamic";
import { ChatDemo } from "@/components/ChatDemo";
import { CTA } from "@/components/CTA";
import { Financials } from "@/components/Financials";
import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { Software } from "@/components/Software";

// Dynamic import for 3D component to avoid SSR issues
const NeoBall3D = dynamic(() => import("@/components/NeoBall3D").then((mod) => mod.NeoBall3D), {
  ssr: false,
  loading: () => (
    <section className="section bg-wolf-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-wolf-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading 3D Experience...</p>
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Section 1: The Hook */}
      <Hero />

      {/* Section 2: The Hardware - NeoBall 3D */}
      <NeoBall3D />

      {/* Section 3: The Software - YP Academy */}
      <Software />

      {/* Section 4: The Metrics - Numbers that matter */}
      <Metrics />

      {/* Section 5: The Moat - AskYP AI Demo */}
      <ChatDemo />

      {/* Section 6: The Economics - Charts & Unit Economics */}
      <Financials />

      {/* Section 7: The Ask - CTA */}
      <CTA />
    </main>
  );
}
