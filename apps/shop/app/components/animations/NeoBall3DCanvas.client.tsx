import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ===========================================================================
// NeoBall3DCanvas - Vanilla Three.js implementation (avoids reconciler issues)
// ===========================================================================

interface NeoBall3DCanvasProps {
  progress?: number;
  impulse?: number;
  sectionStart?: number; // Scroll progress (0-1) when ball section enters view
  sectionEnd?: number; // Scroll progress (0-1) when ball section exits view
}

// Shopify.supply style: scroll-bound horizontal rotation only
// - Logo faces forward at rest
// - Only Y-axis rotation (horizontal spin)
// - Rotation directly mapped to scroll progress WITHIN the ball's section
const ROTATIONS_PER_SECTION = 1.5; // Rotation as you scroll through ball section

export function NeoBall3DCanvas({
  progress = 0,
  impulse = 0,
  sectionStart = 0,
  sectionEnd = 1,
}: NeoBall3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);
  const progressRef = useRef(0);
  const sectionStartRef = useRef(sectionStart);
  const sectionEndRef = useRef(sectionEnd);
  const [isReady, setIsReady] = useState(false);

  // Keep progress and section bounds in sync for animation loop
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    sectionStartRef.current = sectionStart;
    sectionEndRef.current = sectionEnd;
  }, [sectionStart, sectionEnd]);

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
      powerPreference: "high-performance",
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

    const rimLight = new THREE.DirectionalLight(0x00ebf7, 0.35);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.2);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // Load texture and create ball
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/images/neoball-texture.png",
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
        console.error("Failed to load texture:", error);
      },
    );

    // Animation loop - Shopify.supply style scroll-bound rotation
    // Ball only rotates when scrolling WITHIN its section
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        const mesh = meshRef.current;
        const currentProgress = progressRef.current;
        const start = sectionStartRef.current;
        const end = sectionEndRef.current;

        // Calculate section-local progress (0-1 within the ball's section only)
        let sectionProgress = 0;
        if (currentProgress <= start) {
          sectionProgress = 0; // Before section: no rotation
        } else if (currentProgress >= end) {
          sectionProgress = 1; // After section: hold final rotation
        } else {
          // Within section: interpolate 0-1
          sectionProgress = (currentProgress - start) / (end - start);
        }

        // Scroll-bound Y-axis rotation only (like shopify.supply)
        // Section progress 0-1 maps to 0 to (ROTATIONS_PER_SECTION * 2π) radians
        const targetRotationY = sectionProgress * Math.PI * 2 * ROTATIONS_PER_SECTION;

        // Smooth interpolation for fluid feel (lerp factor controls smoothness)
        const lerpFactor = 0.08;
        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * lerpFactor;

        // Keep X and Z fixed - logo faces forward
        mesh.rotation.x = 0;
        mesh.rotation.z = 0;
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

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
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
        width: "100%",
        height: "100%",
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.3s ease-in",
      }}
    />
  );
}

export default NeoBall3DCanvas;
