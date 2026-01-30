"use client";

import { DossierData } from "./data";
import {
  Hero,
  ServiceRecord,
  ConnectorLine,
  VideoQuote,
  MethodologySection,
  MissionProfile,
  ProtocolCards,
  FAQ,
  CTABlock,
  StickyBar,
} from "./components";

interface DossierClientProps {
  data: DossierData;
}

export function DossierClient({ data }: DossierClientProps) {
  return (
    <>
      {/* Page Content */}
      <main className="dossier-page">
        <Hero {...data.hero} />
        <ServiceRecord stats={data.stats} />
        {/* Connector Line - Visual link to protocols */}
        <ConnectorLine />
        {/* Protocols moved UP - primary conversion zone */}
        <ProtocolCards protocols={data.protocols} />
        <VideoQuote {...data.video} />
        {/* Methodology Section - Perplexity-optimized research content */}
        <MethodologySection {...data.methodology} />
        <MissionProfile {...data.mission} />
        <FAQ items={data.faq} />
        <CTABlock {...data.cta} />

        {/* Footer Meta */}
        <footer className="dossier-footer">
          <p className="footer-text">
            Last updated: {data.meta.lastUpdated} · Entity verified by{" "}
            {data.meta.source}
          </p>
        </footer>
      </main>

      {/* Mobile Sticky Bar */}
      <StickyBar {...data.cta} />

      <style jsx>{`
        .dossier-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
        }

        .dossier-footer {
          padding: 48px 24px;
          text-align: center;
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-text {
          font-family: var(--pillar-font-mono, monospace);
          font-size: 11px;
          color: #444;
          letter-spacing: 1px;
        }
      `}</style>
    </>
  );
}
