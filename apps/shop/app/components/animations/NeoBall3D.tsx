import { useEffect, useState } from "react";

// ===========================================================================
// NeoBall3D - 3D rotating basketball with texture mapping
// Client-only component to avoid SSR issues with Three.js
// ===========================================================================

// Loading fallback - Space Grotesk font for all loaders
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-cyan/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-cyan rounded-full animate-spin" />
      </div>
      {/* Loading text */}
      <span className="font-loading text-xs tracking-[0.2em] uppercase text-cyan/70">Loading</span>
    </div>
  );
}

// Fallback image when WebGL not available
function FallbackImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src="/images/neoball-hero.png"
        alt="NeoBall"
        className="w-full h-full max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  );
}

interface NeoBall3DProps {
  progress?: number;
  impulse?: number;
  className?: string;
  sectionStart?: number; // Scroll progress (0-1) when ball section enters view
  sectionEnd?: number; // Scroll progress (0-1) when ball section exits view
}

export function NeoBall3D({
  progress = 0,
  impulse = 0,
  className = "",
  sectionStart = 0,
  sectionEnd = 1,
}: NeoBall3DProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic import of the Three.js canvas component on client only
  useEffect(() => {
    let mounted = true;

    // Check WebGL support first
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Dynamic import the canvas component (client-only)
    import("./NeoBall3DCanvas.client")
      .then((mod) => {
        if (mounted) {
          setComponent(() => mod.NeoBall3DCanvas);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load 3D canvas:", err);
        if (mounted) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (hasError) {
    return (
      <div className={`relative ${className}`}>
        <FallbackImage />
      </div>
    );
  }

  if (isLoading || !Component) {
    return (
      <div className={`relative ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect behind ball */}
      <div className="absolute inset-0 bg-cyan/15 blur-[80px] rounded-full" />
      <Component
        progress={progress}
        impulse={impulse}
        sectionStart={sectionStart}
        sectionEnd={sectionEnd}
      />
    </div>
  );
}

export default NeoBall3D;
