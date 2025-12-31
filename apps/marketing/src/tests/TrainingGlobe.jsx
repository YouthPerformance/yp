import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

// Top 20 Populous Cities + LA (Lat, Long)
// These are the permanent "Hub" nodes.
const MAJOR_CITIES = [
  { location: [35.6762, 139.6503], size: 0.05 },  // Tokyo
  { location: [28.7041, 77.1025], size: 0.05 },   // Delhi
  { location: [31.2304, 121.4737], size: 0.05 },  // Shanghai
  { location: [-6.2088, 106.8456], size: 0.05 },  // Jakarta
  { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
  { location: [19.4326, -99.1332], size: 0.05 },  // Mexico City
  { location: [30.0444, 31.2357], size: 0.05 },   // Cairo
  { location: [19.0760, 72.8777], size: 0.05 },   // Mumbai
  { location: [39.9042, 116.4074], size: 0.05 },  // Beijing
  { location: [23.8103, 90.4125], size: 0.05 },   // Dhaka
  { location: [34.6937, 135.5023], size: 0.05 },  // Osaka
  { location: [40.7128, -74.0060], size: 0.05 },  // New York
  { location: [24.8607, 67.0011], size: 0.05 },   // Karachi
  { location: [34.0522, -118.2437], size: 0.07 }, // Los Angeles (Featured)
  { location: [30.5728, 104.0668], size: 0.05 },  // Chengdu
  { location: [41.0082, 28.9784], size: 0.05 },   // Istanbul
  { location: [14.5995, 120.9842], size: 0.05 },  // Manila
  { location: [22.5726, 88.3639], size: 0.05 },   // Kolkata
  { location: [6.5244, 3.3792], size: 0.05 },     // Lagos
  { location: [-22.9068, -43.1729], size: 0.05 }, // Rio
  { location: [51.5074, -0.1278], size: 0.05 },   // London
];

export default function TrainingGlobe() {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const markersRef = useRef([...MAJOR_CITIES]);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    // Spawning Logic (Dynamic Dots)
    const spawnInterval = setInterval(() => {
      // Generate a random lat/long
      const randomLat = (Math.random() - 0.5) * 180;
      const randomLng = (Math.random() - 0.5) * 360;

      // Add the new "Kid finished workout" marker
      const newMarker = { location: [randomLat, randomLng], size: 0.03 };

      markersRef.current = [...markersRef.current, newMarker];

      // Keep array size manageable
      if (markersRef.current.length > 40) {
        markersRef.current = [...MAJOR_CITIES, ...markersRef.current.slice(-20)];
      }
    }, Math.random() * 2000 + 2000); // Randomly between 2s and 4s

    // Initialize Globe
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (canvasRef.current) {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.3,
        dark: 1, // Dark Mode
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.1], // Deep Charcoal
        markerColor: [0, 0.96, 0.88], // YP Cyan (#00F6E0)
        glowColor: [0, 0.3, 0.3], // Subtle cyan glow
        markers: markersRef.current.map(m => ({
          location: m.location,
          size: m.size
        })),
        onRender: (state) => {
          // Slow spin animation
          state.phi = phi;
          phi += 0.003;

          // Update markers dynamically
          state.markers = markersRef.current.map(m => ({
            location: m.location,
            size: m.size
          }));
        },
      });
    }

    return () => {
      clearInterval(spawnInterval);
      if (globeRef.current) {
        globeRef.current.destroy();
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto aspect-square relative">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", contain: "layout paint size" }}
        className="opacity-90"
      />
      {/* Overlay Text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#00F6E0] text-xs font-mono animate-pulse tracking-widest">
        LIVE TRAINING NODES
      </div>
    </div>
  );
}
