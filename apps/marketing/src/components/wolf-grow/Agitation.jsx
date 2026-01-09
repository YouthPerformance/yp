// Agitation - The Sports Parent Tax
// E14-3: Scrollytelling with pinned text swaps

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./motion";

const IMPACT_WORDS = [
  { text: "THE COMMUTE.", effect: "impact" },
  { text: "THE COST.", effect: "impact" },
  { text: "THE INJURY RISK.", effect: "glitch" },
];

const BODY_COPY = `Let's be honest. You love watching them play, but the "Youth Sports Industrial Complex" is exhausting.

You are spending 3+ hours a day in the car. You're dropping $1,500+ a year on fees, gear, and private trainers who just count reps.

The worst part? You see kids getting hurt. ACL tears at 13. Burnout at 15.

You want them to reach their potential. But you shouldn't have to sacrifice your family's sanity—or their long-term health—to get there.`;

export function Agitation() {
  const sectionRef = useRef(null);
  const [currentWord, setCurrentWord] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Map scroll progress to word index
  const wordProgress = useTransform(scrollYProgress, [0, 0.6], [0, IMPACT_WORDS.length - 1]);

  useEffect(() => {
    const unsubscribe = wordProgress.on("change", (latest) => {
      setCurrentWord(Math.round(latest));
    });
    return unsubscribe;
  }, [wordProgress]);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh] md:min-h-[300vh] bg-[#050505]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Impact Words */}
        <div className="h-[120px] md:h-[200px] flex items-center justify-center mb-8 md:mb-12">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentWord}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: EASE.impact }}
              className={`text-[48px] md:text-[80px] lg:text-[120px] font-bebas tracking-[-0.02em] text-white text-center
                ${IMPACT_WORDS[currentWord]?.effect === "glitch" ? "text-red-500 animate-pulse" : ""}
              `}
            >
              {IMPACT_WORDS[currentWord]?.text}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Headline */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bebas tracking-wide text-cyan-400 mb-8 text-center"
        >
          THE SYSTEM IS BROKEN. WE FIXED IT.
        </motion.h3>

        {/* Body copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {BODY_COPY.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed mb-4 md:mb-6 text-center"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Call to action line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl lg:text-2xl font-semibold text-white mt-2 md:mt-4 text-center px-4"
        >
          Stop paying for "more reps."
          <br className="md:hidden" />
          <span className="text-cyan-400"> Start building a better athlete.</span>
        </motion.p>
      </div>
    </section>
  );
}

export default Agitation;
