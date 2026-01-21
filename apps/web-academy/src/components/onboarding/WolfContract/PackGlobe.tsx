/**
 * PackGlobe - Global Network Visualization for Wolf Contract
 * Shows the athlete joining the worldwide Pack network
 * Mobile-optimized with responsive sizing
 */

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Three.js
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// Elite Training Hubs (Cyan nodes)
const HUBS = [
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
];

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}

interface Ring {
  lat: number;
  lng: number;
}

interface PackGlobeProps {
  /** Show a special "joining" arc from user's approximate location */
  showJoinArc?: boolean;
  /** Callback when globe is ready */
  onReady?: () => void;
}

export function PackGlobe({ showJoinArc = false, onReady }: PackGlobeProps) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [rings, setRings] = useState<Ring[]>([]);
  const [dimensions, setDimensions] = useState({ width: 280, height: 280 });
  const [isReady, setIsReady] = useState(false);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Mobile: smaller globe, Desktop: larger
        const size = Math.min(containerWidth * 0.9, 320);
        setDimensions({ width: size, height: size });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Globe controls setup
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = false;
      controls.enablePan = false;
      globeEl.current.pointOfView({ altitude: 2.2 });

      setIsReady(true);
      onReady?.();
    }
  }, [onReady]);

  // Arc animation engine
  useEffect(() => {
    if (!isReady) return;

    // Initial "join" arc if enabled
    if (showJoinArc) {
      const target = HUBS[0]; // LA as default hub
      const joinArc: Arc = {
        startLat: 37.7749, // SF area as "you"
        startLng: -122.4194,
        endLat: target.lat,
        endLng: target.lng,
        color: ["#00FFFF", "#00FFFF"], // Solid cyan for join arc
      };
      setArcs([joinArc]);
      setRings([{ lat: target.lat, lng: target.lng }]);
    }

    // Continuous network activity
    const interval = setInterval(() => {
      const startLat = (Math.random() - 0.5) * 140;
      const startLng = (Math.random() - 0.5) * 340;
      const target = HUBS[Math.floor(Math.random() * HUBS.length)];

      const newArc: Arc = {
        startLat,
        startLng,
        endLat: target.lat,
        endLng: target.lng,
        color: ["rgba(0, 255, 255, 0)", "#00FFFF"],
      };

      setArcs((prev) => [...prev.slice(-12), newArc]);

      setTimeout(() => {
        setRings((prev) => [...prev.slice(-4), { lat: target.lat, lng: target.lng }]);
      }, 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, [isReady, showJoinArc]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center"
      style={{ minHeight: dimensions.height }}
    >
      <div className="opacity-90">
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // Arcs (network connections)
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={1800}
          arcStroke={0.6}
          // Hub points
          pointsData={HUBS}
          pointColor={() => "#00FFFF"}
          pointAltitude={0.04}
          pointRadius={0.6}
          // Activity rings
          ringsData={rings}
          ringColor={() => "#00FFFF"}
          ringMaxRadius={5}
          ringPropagationSpeed={2.5}
          ringRepeatPeriod={0}
        />
      </div>
    </div>
  );
}

export default PackGlobe;
