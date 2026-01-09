/**
 * WolfNetworkGlobe - Global Network Visualization
 * Shows live "Arc to Hub" animations connecting users worldwide
 * Uses react-globe.gl for 3D globe rendering
 */

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

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

export default function WolfNetworkGlobe({ width = 350, height = 350 }) {
  const globeEl = useRef();
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);

  useEffect(() => {
    // Auto-rotate physics
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.6;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ altitude: 2.5 });
    }

    // The Pulse Engine - Simulates live user activity
    const interval = setInterval(() => {
      // Random user location
      const startLat = (Math.random() - 0.5) * 150;
      const startLng = (Math.random() - 0.5) * 360;
      const target = HUBS[Math.floor(Math.random() * HUBS.length)];

      // Arc: User -> Hub
      const newArc = {
        startLat,
        startLng,
        endLat: target.lat,
        endLng: target.lng,
        color: ["rgba(0, 255, 255, 0)", "#00FFFF"], // Fade to Cyan
      };

      setArcs((prev) => [...prev.slice(-15), newArc]);

      // Ring: Impact at Hub
      setTimeout(() => {
        setRings((prev) => [...prev.slice(-5), { lat: target.lat, lng: target.lng }]);
      }, 1200);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="opacity-80 mix-blend-screen">
        <Globe
          ref={globeEl}
          width={width}
          height={height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // Arcs (The Network)
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.5}
          arcDashGap={2}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          // Hubs (The Cities)
          pointsData={HUBS}
          pointColor={() => "#00FFFF"}
          pointAltitude={0.05}
          pointRadius={0.8}
          // Rings (The Activity)
          ringsData={rings}
          ringColor={() => "#00FFFF"}
          ringMaxRadius={6}
          ringPropagationSpeed={3}
          ringRepeatPeriod={0}
        />
      </div>
    </div>
  );
}
