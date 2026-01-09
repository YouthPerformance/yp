"use client";

import {
  FinalCard,
  HeroCard,
  MissionCard,
  MobileSwiper,
  OfferCard,
  OriginCard,
  ProblemCard,
  SystemCard,
  TrifectaCard,
} from "./components";
import { CARD_SEQUENCE } from "./constants";

export default function JamesPage() {
  // Render cards in sequence
  const cards = [
    <HeroCard key="hero" />,
    <MissionCard key="mission" />,
    <ProblemCard key="problem" />,
    <OriginCard key="origin" />,
    <TrifectaCard key="trifecta" />,
    <SystemCard key="system" />,
    <OfferCard key="offer" />,
    <FinalCard key="final" />,
  ];

  return (
    <main className="relative bg-[#0a0a0a]">
      {/* Mobile: Full-screen swipeable cards */}
      <div className="block">
        <MobileSwiper cardIds={CARD_SEQUENCE}>{cards}</MobileSwiper>
      </div>
    </main>
  );
}
