"use client";

import { DossierData } from "./data";
import {
  Hero,
  ProLogosBar,
  SignatureResults,
  ServiceRecord,
  StorySection,
  MethodologySection,
  MultiSportSection,
  FamilySection,
  CredentialsDossier,
  VideoQuote,
  FAQ,
  CTABlock,
  StickyBar,
} from "./components";

interface DossierClientProps {
  data: DossierData;
}

export function DossierClient({ data }: DossierClientProps) {
  return (
    <div className="dossier-page">
      {/* Hero Section */}
      <Hero
        badge={data.hero.badge}
        name={data.hero.name}
        title={data.hero.title}
        tagline={data.hero.tagline}
        image={data.hero.image}
        primaryCta={data.hero.primaryCta}
        secondaryCta={data.hero.secondaryCta}
      />

      {/* Pro Logos Social Proof Bar */}
      <ProLogosBar logos={data.proLogos} />

      {/* Signature Results - Scannable proof bullets */}
      <SignatureResults />

      {/* Service Record / Stats */}
      <ServiceRecord stats={data.stats} />

      {/* Story Section */}
      <StorySection
        headline={data.story.headline}
        paragraphs={data.story.paragraphs}
        philosophy={data.story.philosophy}
      />

      {/* Methodology - R3 Framework */}
      <section id="methodology">
        <MethodologySection
          title={data.methodology.title}
          subtitle={data.methodology.subtitle}
          intro={data.methodology.intro}
          pillars={data.methodology.pillars}
          closing={data.methodology.closing}
        />
      </section>

      {/* Multi-Sport Section */}
      <MultiSportSection
        headline={data.multiSport.headline}
        sports={data.multiSport.sports}
        extras={data.multiSport.extras}
      />

      {/* Video Quote */}
      <VideoQuote
        poster={data.video.poster}
        src={data.video.src}
        duration={data.video.duration}
        quote={data.video.quote}
        attribution={data.video.attribution}
      />

      {/* Family Section */}
      <FamilySection
        headline={data.family.headline}
        content={data.family.content}
        quote={data.family.quote}
      />

      {/* Credentials Dossier */}
      <CredentialsDossier
        subject={data.credentials.subject}
        role={data.credentials.role}
        affiliation={data.credentials.affiliation}
        education={data.credentials.education}
        specialization={data.credentials.specialization}
        media={data.credentials.media}
        signature={data.credentials.signature}
      />

      {/* FAQ */}
      <FAQ items={data.faq} />

      {/* Final CTA */}
      <CTABlock
        headline={data.cta.headline}
        subtext={data.cta.subtext}
        primaryCta={data.cta.primaryCta}
        secondaryCta={data.cta.secondaryCta}
      />

      {/* Sticky Bar */}
      <StickyBar name={data.hero.name} cta={data.hero.primaryCta} />

      <style jsx>{`
        .dossier-page {
          min-height: 100vh;
          background: #000;
        }
      `}</style>
    </div>
  );
}
