import { useEffect, useRef } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/**
 * WebGL noise background shader - creates a subtle animated grain/glow effect.
 * Adapted from Shopify Supply's Performance Pack.
 */
export function WebGLNoise({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = prefersReducedMotion();
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true });
    if (!gl) return;

    const vertexSrc = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    const fragSrc = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = v_uv;
  vec2 p = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);

  float t = u_time * 0.12;
  float n1 = noise(p * 2.0 + t);
  float n2 = noise(p * 6.0 - t * 1.7);
  float grain = noise(uv * u_res.xy * 0.35);

  // Dark base + subtle cyan glow drift
  vec3 base = vec3(0.03, 0.03, 0.03);
  vec3 glow = vec3(0.0, 0.92, 0.97); // Cyan #00EBF7
  float vignette = smoothstep(1.1, 0.2, length(p));

  float m = 0.55 * n1 + 0.45 * n2;
  float pulse = 0.35 + 0.65 * sin(u_time * 0.35);
  float g = smoothstep(0.35, 0.85, m) * 0.15 * pulse;

  vec3 col = base + glow * g;
  col += (grain - 0.5) * 0.04; // Film grain
  col *= vignette;

  outColor = vec4(col, 0.4);
}`;

    function compile(glCtx: WebGL2RenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(s));
        glCtx.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const locPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    let raf = 0;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(width * dpr));
      const h = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      resize();
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      const t = reduce ? 0 : (performance.now() - t0) / 1000;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
