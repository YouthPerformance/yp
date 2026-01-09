// Authority - The Living Portraits
// E14-5: Trainer showcase with B&W to color video transitions

import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "./motion";

const TRAINERS = [
  {
    id: 1,
    name: "Coach Marcus",
    title: "NBA Performance Coach",
    bio: "Trained 15+ NBA players. Specialist in foot mechanics.",
    image: "/images/trainer-1.jpg",
  },
  {
    id: 2,
    name: "Dr. Elena",
    title: "Sports Medicine PhD",
    bio: "Published researcher in youth athletic development.",
    image: "/images/trainer-2.jpg",
  },
  {
    id: 3,
    name: "Coach Ray",
    title: "Olympic Track Coach",
    bio: "Coached 3 Olympic medalists. Speed development expert.",
    image: "/images/trainer-3.jpg",
  },
];

function TrainerCard({ trainer }) {
  const [isActive, setIsActive] = useState(false);

  // Handle both hover and touch
  const handleInteractionStart = () => setIsActive(true);
  const handleInteractionEnd = () => setIsActive(false);

  return (
    <motion.div
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group touch-manipulation"
    >
      {/* B&W Image (default) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 transition-opacity duration-300 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
        style={{
          filter: "grayscale(100%) contrast(1.2)",
        }}
      >
        {/* Placeholder for actual image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl md:text-6xl opacity-50">👤</span>
        </div>
      </div>

      {/* Color Video/Image (on hover/touch) */}
      <motion.div
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-b from-cyan-900/50 to-cyan-700/30"
      >
        {/* Cyan overlay */}
        <div className="absolute inset-0 bg-cyan-400/20 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl"
          >
            🎬
          </motion.span>
        </div>
      </motion.div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className="text-lg md:text-xl font-bebas text-white tracking-wide">{trainer.name}</h3>
        <p className="text-cyan-400 text-xs md:text-sm">{trainer.title}</p>
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
          className="text-gray-400 text-xs mt-2 overflow-hidden"
        >
          {trainer.bio}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function Authority() {
  return (
    <section className="relative py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE.reveal }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bebas tracking-[-0.02em] text-white mb-4">
            TRAIN WITH THE <span className="text-cyan-400">MASTERS.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your child won't be trained by influencers. They will be trained by the experts who
            build professionals.
          </p>
        </motion.div>

        {/* Trainer Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {TRAINERS.map((trainer, i) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE.reveal }}
              viewport={{ once: true }}
            >
              <TrainerCard trainer={trainer} />
            </motion.div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mt-12 max-w-xl mx-auto"
        >
          Our team trains athletes in the NBA, NFL, and Olympics. We've distilled their elite
          protocols into micro-doses that fit into a student-athlete's busy life.
        </motion.p>
      </div>
    </section>
  );
}

export default Authority;
