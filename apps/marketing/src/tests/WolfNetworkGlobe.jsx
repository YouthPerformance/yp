import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

// The "Hubs" (Major YP Centers)
const HUBS = [
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, color: "#00F6E0" },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, color: "#FF0055" },
  { name: "New York", lat: 40.7128, lng: -74.006, color: "#00F6E0" },
  { name: "London", lat: 51.5074, lng: -0.1278, color: "#00F6E0" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: "#00F6E0" },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, color: "#00F6E0" },
];

// Generate random "Kid" locations
const generateRandomPoint = () => ({
  lat: (Math.random() - 0.5) * 160,
  lng: (Math.random() - 0.5) * 360,
});

export default function WolfNetworkGlobe() {
  const globeEl = useRef();
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
      const size = Math.min(window.innerWidth * 0.8, 800);
      setDimensions({ width: size, height: size });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.4;
      globeEl.current.pointOfView({ altitude: 2.5 });
    }

    // THE "PULSE" ENGINE
    // Every 800ms, a kid "finishes a workout" (spawns an arc)
    const interval = setInterval(() => {
      const randomStart = generateRandomPoint();
      const targetHub = HUBS[Math.floor(Math.random() * HUBS.length)];

      // Create the Arc (Flight Path)
      const newArc = {
        startLat: randomStart.lat,
        startLng: randomStart.lng,
        endLat: targetHub.lat,
        endLng: targetHub.lng,
        color: ["rgba(0, 246, 224, 0.2)", "#00F6E0", "rgba(0, 246, 224, 0.2)"],
      };

      setArcs((cur) => [...cur.slice(-15), newArc]);

      // Trigger a Ripple at the Hub (Impact)
      setTimeout(() => {
        setRings((cur) => [
          ...cur.slice(-4),
          {
            lat: targetHub.lat,
            lng: targetHub.lng,
            maxR: 5,
            propagationSpeed: 2,
            repeatPeriod: 0,
          },
        ]);
      }, 1000);
    }, 800);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="cursor-grab active:cursor-grabbing">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        // THE ARCS (FLIGHT PATHS)
        arcsData={arcs}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcStroke={0.5}
        // THE HUBS (PILLARS)
        pointsData={HUBS}
        pointColor="color"
        pointAltitude={0.1}
        pointRadius={0.4}
        pointLabel="name"
        // THE RIPPLES (IMPACT RINGS)
        ringsData={rings}
        ringColor={() => "#00F6E0"}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={0}
        // Atmosphere
        atmosphereColor="#00F6E0"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}
