/**
 * Wolf Pill Beta Badge
 * ====================
 * Shared component for YP ecosystem
 *
 * Three variants:
 * - stealth: Clean, low profile (zinc tones)
 * - glow: Default Wolf aesthetic (cyan glow)
 * - holographic: Glassmorphism + RGB split
 */

export type BetaBadgeVariant = "stealth" | "glow" | "holographic";

export interface BetaBadgeProps {
  variant?: BetaBadgeVariant;
  className?: string;
}

const variants: Record<
  BetaBadgeVariant,
  { container: React.CSSProperties; ping: string; dot: string }
> = {
  stealth: {
    container: {
      backgroundColor: "#000000",
      borderColor: "#3f3f46",
      color: "#71717a",
    },
    ping: "#71717a",
    dot: "#52525b",
  },
  glow: {
    container: {
      backgroundColor: "#000000",
      borderColor: "#00F6E0",
      color: "#00F6E0",
      boxShadow: "0 0 12px rgba(0,246,224,0.15)",
    },
    ping: "#22d3ee",
    dot: "#00F6E0",
  },
  holographic: {
    container: {
      backgroundColor: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(8px)",
      borderColor: "rgba(0,246,224,0.5)",
      color: "#ffffff",
      boxShadow: "inset 0 0 10px rgba(0,246,224,0.1)",
    },
    ping: "#22d3ee",
    dot: "#00F6E0",
  },
};

export function BetaBadge({ variant = "glow", className = "" }: BetaBadgeProps) {
  const styles = variants[variant];

  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "4px 12px",
          borderRadius: "9999px",
          border: "1px solid",
          transition: "all 0.3s ease-out",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          userSelect: "none" as const,
          ...styles.container,
        }}
      >
        {/* Live Pulsing Dot */}
        <span style={{ position: "relative", display: "flex", height: "6px", width: "6px" }}>
          <span
            style={{
              position: "absolute",
              display: "inline-flex",
              height: "100%",
              width: "100%",
              borderRadius: "9999px",
              opacity: 0.75,
              backgroundColor: styles.ping,
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              borderRadius: "9999px",
              height: "6px",
              width: "6px",
              backgroundColor: styles.dot,
            }}
          />
        </span>
        {/* Text */}
        BETA
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default BetaBadge;
