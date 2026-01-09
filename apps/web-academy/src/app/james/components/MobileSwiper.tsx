"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";
import type { CardId } from "../constants";

// Swipe detection thresholds
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;

interface MobileSwiperProps {
  children: React.ReactNode[];
  cardIds: readonly CardId[];
}

export function MobileSwiper({ children, cardIds }: MobileSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === children.length - 1;

  const goToNext = useCallback(() => {
    if (currentIndex < children.length - 1) {
      setDirection("up");
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, children.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection("down");
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;

      // Swipe up = next card
      if (offset.y < -SWIPE_THRESHOLD || velocity.y < -SWIPE_VELOCITY) {
        goToNext();
      }
      // Swipe down = previous card
      else if (offset.y > SWIPE_THRESHOLD || velocity.y > SWIPE_VELOCITY) {
        goToPrev();
      }
    },
    [goToNext, goToPrev],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      }
    },
    [goToNext, goToPrev],
  );

  // Animation variants
  const variants = {
    enter: (dir: "up" | "down") => ({
      y: dir === "up" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: "up" | "down") => ({
      y: dir === "up" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Card Container */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 touch-pan-y"
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-1.5">
        {cardIds.map((id, index) => (
          <button
            key={id}
            onClick={() => {
              setDirection(index > currentIndex ? "up" : "down");
              setCurrentIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-[#00f6e0]" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Indicator (not on last card) */}
      {!isLastCard && (
        <motion.div
          className="absolute bottom-16 left-1/2 z-40 -translate-x-1/2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-1 text-white/40">
            <ChevronUp className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-widest">Swipe up</span>
          </div>
        </motion.div>
      )}

      {/* Navigation Arrows (Desktop) */}
      <div className="absolute right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        <button
          onClick={goToPrev}
          disabled={isFirstCard}
          className={`rounded-full border border-white/10 p-2 backdrop-blur-sm transition-all ${
            isFirstCard
              ? "cursor-not-allowed opacity-30"
              : "hover:border-[#00f6e0]/50 hover:bg-white/5"
          }`}
          aria-label="Previous card"
        >
          <ChevronUp className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          disabled={isLastCard}
          className={`rounded-full border border-white/10 p-2 backdrop-blur-sm transition-all ${
            isLastCard
              ? "cursor-not-allowed opacity-30"
              : "hover:border-[#00f6e0]/50 hover:bg-white/5"
          }`}
          aria-label="Next card"
        >
          <ChevronUp className="h-5 w-5 rotate-180 text-white" />
        </button>
      </div>

      {/* Card Counter */}
      <div className="absolute right-4 top-4 z-40 font-mono text-xs text-white/30">
        {String(currentIndex + 1).padStart(2, "0")} / {String(children.length).padStart(2, "0")}
      </div>
    </div>
  );
}
