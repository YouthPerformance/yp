import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ===========================================================================
// NeoBall3DCanvas - Vanilla Three.js implementation (avoids reconciler issues)
// ===========================================================================

interface NeoBall3DCanvasProps {
  progress?: number;
  impulse?: number;
}

export function NeoBall3DCanvas({ progress = 0, impulse = 0 }: NeoBall3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);
  const velocityRef = useRef({ x: 0, y: 0 });
  const impulseRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  // Keep impulse in sync
  useEffect(() => {
    impulseRef.current = impulse;
  }, [impulse]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
    mainLight.position.set(4, 2, 3);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
    fillLight.position.set(-4, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00EBF7, 0.35);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.2);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // Load texture and create ball
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/neoball-texture.webp',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // Material with texture
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.92,
          metalness: 0.0,
          bumpMap: texture,
          bumpScale: 0.02,
          envMapIntensity: 0.12,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(1.8);
        scene.add(mesh);
        meshRef.current = mesh;

        setIsReady(true);
      },
      undefined,
      (error) => {
        console.error('Failed to load texture:', error);
      }
    );

    // Animation loop
    let lastTime = performance.now();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (meshRef.current) {
        const mesh = meshRef.current;
        const currentImpulse = impulseRef.current;

        // Base rotation speeds - visible but smooth
        const baseSpinY = 0.6;  // ~35°/sec on Y axis
        const baseSpinX = 0.15; // ~9°/sec on X axis (slower tilt)

        // Scroll-driven boost (reduced for smoother feel)
        const boostMultiplier = 1 + currentImpulse * 2.5;

        // Apply momentum from scroll (reduced sensitivity)
        velocityRef.current.x += currentImpulse * 0.08;
        velocityRef.current.y += currentImpulse * 0.15;

        // Damping (increased friction for quicker settling)
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;

        // Apply rotation (delta-normalized for consistent speed)
        mesh.rotation.y += baseSpinY * delta * boostMultiplier + velocityRef.current.y * delta;
        mesh.rotation.x += baseSpinX * delta * boostMultiplier + velocityRef.current.x * delta;

        // Subtle wobble
        mesh.rotation.z += Math.sin(currentTime * 0.0003) * 0.0008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);

      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        (meshRef.current.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
      }}
    />
  );
}

export default NeoBall3DCanvas;
