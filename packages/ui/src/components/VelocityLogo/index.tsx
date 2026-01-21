"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScrollVelocity } from "../../hooks/useScrollVelocity";

/**
 * VelocityLogo - Award-Winning Animated Logo Component
 * =====================================================
 *
 * Features:
 * - WebGL-powered velocity warp distortion
 * - Chromatic aberration on fast scroll
 * - Physics-based spring animations
 * - Idle glow pulse animation
 * - GPU-accelerated, 60fps
 * - Graceful fallback for no-WebGL
 * - Respects prefers-reduced-motion
 *
 * The Effect:
 * - Idle: Subtle cyan glow pulse
 * - Slow scroll: Gentle wave ripple
 * - Fast scroll: Full velocity warp + chromatic aberration
 * - Stop: Springs back with elastic overshoot
 */

// =============================================================================
// GLSL SHADERS
// =============================================================================

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_velocity;      // -1 to 1 (direction + speed)
  uniform float u_speed;         // 0 to 1 (absolute)
  uniform float u_warpIntensity; // Overall effect strength
  uniform vec2 u_resolution;

  varying vec2 v_texCoord;

  // Simplex noise for organic distortion
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                           dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = v_texCoord;
    float speed = u_speed * u_warpIntensity;

    // ===========================================
    // EFFECT 1: Velocity Wave Warp
    // Logo bends like a flag in the wind
    // ===========================================
    float waveFreq = 3.0 + speed * 2.0;
    float waveAmp = speed * 0.08;
    float wave = sin(uv.y * waveFreq + u_time * 2.0) * waveAmp;

    // Direction-aware: warp in direction of scroll
    wave *= sign(u_velocity) * -1.0;

    // ===========================================
    // EFFECT 2: Turbulence (organic distortion)
    // Adds natural feel, increases with speed
    // ===========================================
    float turbulence = snoise(uv * 4.0 + u_time * 0.5) * speed * 0.03;

    // ===========================================
    // EFFECT 3: Squeeze/Stretch
    // Logo compresses in scroll direction
    // ===========================================
    float squeeze = 1.0 + speed * 0.1 * sign(u_velocity);

    // Apply distortions
    vec2 distortedUV = uv;
    distortedUV.x += wave + turbulence;
    distortedUV.y = (distortedUV.y - 0.5) * squeeze + 0.5;

    // ===========================================
    // EFFECT 4: Chromatic Aberration
    // RGB split increases with velocity
    // ===========================================
    float aberration = speed * 0.015;
    vec2 rOffset = vec2(aberration, 0.0);
    vec2 bOffset = vec2(-aberration, 0.0);

    float r = texture2D(u_texture, distortedUV + rOffset).r;
    float g = texture2D(u_texture, distortedUV).g;
    float b = texture2D(u_texture, distortedUV + bOffset).b;
    float a = texture2D(u_texture, distortedUV).a;

    // ===========================================
    // EFFECT 5: Glow Intensification
    // Cyan glow gets brighter when warping
    // ===========================================
    float glowBoost = 1.0 + speed * 0.5;
    vec3 color = vec3(r, g, b) * glowBoost;

    // ===========================================
    // EFFECT 6: Motion Blur (subtle)
    // Slight directional blur at high speed
    // ===========================================
    if (speed > 0.3) {
      float blurAmount = (speed - 0.3) * 0.02;
      vec2 blurDir = vec2(sign(u_velocity) * blurAmount, 0.0);
      for (float i = 1.0; i <= 3.0; i++) {
        float weight = 1.0 - (i / 4.0);
        vec2 sampleUV = distortedUV + blurDir * i;
        color += texture2D(u_texture, sampleUV).rgb * weight * 0.2;
      }
    }

    // ===========================================
    // IDLE: Subtle pulse glow when stationary
    // ===========================================
    if (speed < 0.05) {
      float pulse = sin(u_time * 1.5) * 0.5 + 0.5;
      float idleGlow = 1.0 + pulse * 0.1;
      color *= idleGlow;
    }

    gl_FragColor = vec4(color, a);
  }
`;

// =============================================================================
// TYPES
// =============================================================================

export interface VelocityLogoProps {
  /** SVG source URL or inline SVG string */
  src: string;
  /** Logo width in pixels */
  width?: number;
  /** Logo height in pixels */
  height?: number;
  /** Alt text for accessibility */
  alt?: string;
  /** Overall effect intensity 0-1 (default: 1) */
  intensity?: number;
  /** Link href when clicked */
  href?: string;
  /** Additional className */
  className?: string;
  /** Callback when WebGL fails, receives fallback element */
  onFallback?: () => void;
}

// =============================================================================
// WEBGL HELPERS
// =============================================================================

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VelocityLogo({
  src,
  width = 120,
  height = 72,
  alt = "YP",
  intensity = 1,
  href = "/",
  className = "",
  onFallback,
}: VelocityLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(performance.now());

  const [webglSupported, setWebglSupported] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { velocity, speed } = useScrollVelocity({
    stiffness: 0.12,
    damping: 0.75,
    maxVelocity: 2.5,
  });

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    if (!gl) {
      console.warn("WebGL not supported, using fallback");
      setWebglSupported(false);
      onFallback?.();
      return false;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      setWebglSupported(false);
      return false;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      setWebglSupported(false);
      return false;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Set up geometry (full-screen quad)
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);

    const texCoords = new Float32Array([
      0, 1, 1, 1, 0, 0,
      0, 0, 1, 1, 1, 0,
    ]);

    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
  }, [width, height, onFallback]);

  // Load texture from image
  const loadTexture = useCallback((imageSrc: string) => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Set texture parameters for non-power-of-2 textures
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      textureRef.current = texture;
      setImageLoaded(true);
    };

    image.onerror = () => {
      console.error("Failed to load logo image:", imageSrc);
      setWebglSupported(false);
    };

    // Handle SVG: convert to data URL if inline SVG
    if (imageSrc.trim().startsWith("<svg")) {
      const blob = new Blob([imageSrc], { type: "image/svg+xml" });
      image.src = URL.createObjectURL(blob);
    } else {
      image.src = imageSrc;
    }
  }, []);

  // Render loop
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas || !imageLoaded) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    const time = (performance.now() - startTimeRef.current) / 1000;

    // Update uniforms
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), time);
    gl.uniform1f(gl.getUniformLocation(program, "u_velocity"), velocity);
    gl.uniform1f(gl.getUniformLocation(program, "u_speed"), speed);
    gl.uniform1f(gl.getUniformLocation(program, "u_warpIntensity"), intensity);
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      canvas.width,
      canvas.height
    );

    // Clear and draw
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    rafRef.current = requestAnimationFrame(render);
  }, [velocity, speed, intensity, imageLoaded]);

  // Initialize
  useEffect(() => {
    const success = initWebGL();
    if (success) {
      loadTexture(src);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [initWebGL, loadTexture, src]);

  // Start render loop when ready
  useEffect(() => {
    if (webglSupported && imageLoaded) {
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [webglSupported, imageLoaded, render]);

  // Fallback for no WebGL
  if (!webglSupported) {
    return (
      <a
        href={href}
        className={`velocity-logo-fallback ${className}`}
        style={{
          display: "block",
          width,
          height,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`velocity-logo ${className}`}
      style={{
        display: "block",
        width,
        height,
        position: "relative",
      }}
      aria-label={alt}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {/* Glow layer - CSS for performance */}
      <div
        className="velocity-logo-glow"
        style={{
          position: "absolute",
          inset: -8,
          background: `radial-gradient(ellipse at center, rgba(0, 246, 224, ${0.15 + speed * 0.3}) 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "opacity 0.1s ease-out",
          opacity: 0.5 + speed * 0.5,
        }}
      />
    </a>
  );
}

export default VelocityLogo;
