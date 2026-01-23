// ═══════════════════════════════════════════════════════════
// BASKETBALL HUB PAGE
// /basketball - Index of all basketball content
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import { getPillarPages, getExpert } from "@/lib/seo-content";

export const metadata: Metadata = {
  title: "Basketball Training Guides | YouthPerformance",
  description: "Elite basketball training guides from NBA skills coach Adam Harrington. Silent training, home workouts, and development programs for youth players.",
  openGraph: {
    title: "Basketball Training Guides | YouthPerformance",
    description: "Elite basketball training guides from NBA skills coach Adam Harrington.",
    type: "website",
  },
};

export default function BasketballHubPage() {
  const pillars = getPillarPages();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-accent-primary/30 rounded-full bg-accent-primary/5">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span className="text-xs font-mono text-accent-primary tracking-widest uppercase">
              Training Hub
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-bebas uppercase mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Basketball
            </span>
            <br />
            <span className="text-accent-primary drop-shadow-[0_0_25px_rgba(0,246,224,0.4)]">
              Training Guides
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-[50ch] mx-auto leading-relaxed">
            Elite training methodology from NBA skills coach Adam Harrington.
            Build handles, develop footwork, and train like a pro—anywhere.
          </p>
        </div>
      </section>

      {/* Pillar Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {pillars.map((pillar) => {
              const expert = getExpert(pillar.expert);
              return (
                <Link
                  key={pillar.slug}
                  href={pillar.slug}
                  className="group p-8 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs font-mono tracking-wider uppercase rounded bg-accent-primary/10 text-accent-primary mb-3">
                        Complete Guide
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bebas tracking-wider text-white group-hover:text-accent-primary transition-colors">
                        {pillar.title}
                      </h2>
                    </div>
                    {pillar.knowledge_graph?.total_cluster_volume && (
                      <span className="text-sm text-text-tertiary whitespace-nowrap">
                        {pillar.knowledge_graph.total_cluster_volume.toLocaleString()} monthly searches
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {pillar.meta_description}
                  </p>

                  {expert && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}
                      >
                        {expert.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{expert.name}</p>
                        <p className="text-xs text-text-tertiary">{expert.title}</p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 rounded-xl text-center"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <h2 className="font-bebas text-3xl tracking-wider mb-3 text-white">
              TRAIN SILENT. TRAIN ANYWHERE.
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              The world's best silent basketball—according to the kids.
            </p>
            <a
              href="https://neoball.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-wide text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
                boxShadow: "0 0 20px rgba(0, 246, 224, 0.3)",
              }}
            >
              Enter the Draft →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
