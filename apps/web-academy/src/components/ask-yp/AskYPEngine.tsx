// ═══════════════════════════════════════════════════════════
// ASK YP ENGINE - Main orchestrator component
// Combines: Hero input + Smart FAB + Modal
// Handles scroll detection and keyboard shortcuts
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AskYPHero } from "./AskYPHero";
import { AskYPFab } from "./AskYPFab";
import { AskYPModal } from "./AskYPModal";

interface AskYPEngineProps {
  heroRef?: React.RefObject<HTMLDivElement>;
}

export function AskYPEngine({ heroRef: externalHeroRef }: AskYPEngineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [initialQuery, setInitialQuery] = useState("");
  const internalHeroRef = useRef<HTMLDivElement>(null);

  const heroRef = externalHeroRef || internalHeroRef;

  // Scroll observer - show FAB when hero is out of view
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsHeroVisible(heroBottom > 100); // 100px buffer
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  // Keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle search from hero input
  const handleHeroSearch = useCallback((query: string) => {
    setInitialQuery(query);
    setIsModalOpen(true);
  }, []);

  // Handle FAB click
  const handleFabClick = useCallback(() => {
    setInitialQuery("");
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setInitialQuery("");
  }, []);

  return (
    <>
      {/* Smart FAB - appears when hero is scrolled away */}
      <AskYPFab
        visible={!isHeroVisible && !isModalOpen}
        onClick={handleFabClick}
      />

      {/* Modal */}
      <AskYPModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialQuery={initialQuery}
      />
    </>
  );
}

// Export a combined hero + engine for convenience
export function AskYPHeroWithEngine() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [initialQuery, setInitialQuery] = useState("");

  // Scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsHeroVisible(heroBottom > 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setInitialQuery(query);
    setIsModalOpen(true);
  };

  return (
    <>
      <div ref={heroRef}>
        <AskYPHero onSearch={handleSearch} onFocus={() => setIsModalOpen(true)} />
      </div>

      <AskYPFab
        visible={!isHeroVisible && !isModalOpen}
        onClick={() => {
          setInitialQuery("");
          setIsModalOpen(true);
        }}
      />

      <AskYPModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInitialQuery("");
        }}
        initialQuery={initialQuery}
      />
    </>
  );
}
