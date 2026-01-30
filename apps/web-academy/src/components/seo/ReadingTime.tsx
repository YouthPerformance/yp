// ═══════════════════════════════════════════════════════════
// READING TIME DISPLAY
// "X min read" display with clock icon
// ═══════════════════════════════════════════════════════════

interface ReadingTimeProps {
  /** Word count of the content */
  wordCount: number;
  /** Words per minute (default: 200) */
  wordsPerMinute?: number;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Displays estimated reading time based on word count
 * Shows clock icon and "X min read" text
 */
export function ReadingTime({
  wordCount,
  wordsPerMinute = 200,
  className = "",
}: ReadingTimeProps) {
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return (
    <div
      className={`flex items-center gap-1.5 text-sm ${className}`}
      style={{ color: "var(--text-tertiary)" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {minutes} min read
      </span>
    </div>
  );
}
