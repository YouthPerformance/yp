// SafetyNote - Wolf response block for safety callouts
// Parent-friendly safety messaging with calm authority

function SafetyNote({ type = "info", title, children, compact = false }) {
  const variants = {
    info: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      icon: "text-cyan-500",
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: "text-yellow-400",
      iconPath:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    stop: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: "text-red-400",
      iconPath: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: "text-green-400",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const variant = variants[type] || variants.info;

  return (
    <div
      className={`
      ${variant.bg} ${variant.border} border rounded-lg
      ${compact ? "p-2" : "p-3"}
    `}
    >
      <div className="flex items-start gap-2">
        <svg
          className={`w-5 h-5 flex-shrink-0 ${variant.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={variant.iconPath} />
        </svg>
        <div>
          {title && (
            <p className={`font-medium text-white ${compact ? "text-sm" : ""} mb-1`}>{title}</p>
          )}
          <div className={`text-dark-text-secondary ${compact ? "text-xs" : "text-sm"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-built safety notes for common scenarios
export const SAFETY_NOTES = {
  stopRule: (
    <SafetyNote type="warning" title="Stop Rule">
      Sharp pain or limping = stop and reset. No pushing through.
    </SafetyNote>
  ),
  returnCarefully: (
    <SafetyNote type="info" title="Coming Back Carefully">
      Start gentle. Build tolerance the right way. If something feels off, rest and try again
      tomorrow.
    </SafetyNote>
  ),
  quietLanding: (
    <SafetyNote type="info" title="Quiet Landings">
      Focus on landing soft and quiet. If you hear a loud thump, slow down and absorb more with your
      legs.
    </SafetyNote>
  ),
  noJumps: (
    <SafetyNote type="info" title="No Jumps Today">
      This session is low-impact. No jumping. Focus on control and stability.
    </SafetyNote>
  ),
  parentTip: (
    <SafetyNote type="success" title="Parent Tip">
      Short sessions you can repeat beat long sessions you skip. Consistency wins.
    </SafetyNote>
  ),
};

export default SafetyNote;
