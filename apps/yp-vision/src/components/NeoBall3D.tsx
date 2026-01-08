"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";

function Ball() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow auto-rotation
      meshRef.current.rotation.y += 0.003;
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#1a1a1a"
        roughness={0.8}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#00ff88"
        castShadow
      />
      <spotLight
        position={[-5, 3, -5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#00d4ff"
      />
      <Ball />
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      <Environment preset="night" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function NeoBall3D() {
  return (
    <section className="section bg-wolf-black relative">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="touch-none"
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-wolf-neon font-mono text-sm tracking-[0.3em] uppercase mb-4">
            The Hardware
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            NEOBALL
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
            The silent training ball that enters the home.
            <br />
            <span className="text-wolf-neon">8,500+ sold.</span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-gray-600 text-sm"
        >
          Drag to rotate
        </motion.p>
      </div>
    </section>
  );
}
