/**
 * Wolf Pill Beta Badge
 *
 * Three variants:
 * - stealth: Clean, low profile (zinc tones)
 * - glow: Default Wolf aesthetic (cyan glow)
 * - holographic: Glassmorphism + RGB split
 */

const variants = {
  stealth: {
    container: "bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300",
    ping: "bg-zinc-500",
    dot: "bg-zinc-600",
  },
  glow: {
    container:
      "bg-black border-cyan-500 text-cyan-500 shadow-[0_0_12px_rgba(0,246,224,0.15)] hover:shadow-[0_0_20px_rgba(0,246,224,0.4)] hover:bg-cyan-500/5",
    ping: "bg-cyan-400",
    dot: "bg-cyan-500",
  },
  holographic: {
    container:
      "bg-black/80 backdrop-blur-md border-cyan-500/50 text-white shadow-[inset_0_0_10px_rgba(0,246,224,0.1)] hover:border-cyan-400 hover:text-cyan-400",
    ping: "bg-cyan-400",
    dot: "bg-cyan-500",
  },
};

export default function BetaBadge({ variant = "glow", className = "" }) {
  const styles = variants[variant] || variants.glow;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`
        relative flex items-center justify-center gap-2 px-3 py-1
        rounded-full border transition-all duration-300 ease-out
        font-mono text-[10px] font-bold tracking-[0.2em] uppercase select-none
        ${styles.container}
      `}
      >
        {/* Live Pulsing Dot */}
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${styles.ping}
          `}
          />
          <span
            className={`
            relative inline-flex rounded-full h-1.5 w-1.5
            ${styles.dot}
          `}
          />
        </span>
        {/* Text */}
        BETA
      </div>
    </div>
  );
}
