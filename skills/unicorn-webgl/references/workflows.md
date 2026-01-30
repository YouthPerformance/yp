# Unicorn + WebGL Workflows

## Table of Contents
1. [Scroll-Driven 3D Hero](#scroll-driven-3d-hero)
2. [Unicorn Embed in Next.js](#unicorn-embed-in-nextjs)
3. [Custom Shader + GSAP Integration](#custom-shader--gsap-integration)
4. [Unicorn Effect → Three.js Translation](#unicorn-effect--threejs-translation)

---

## Scroll-Driven 3D Hero

**Goal:** Camera moves through 3D scene as user scrolls, with synced UI reveals.

### Stack
- Three.js / R3F
- GSAP + ScrollTrigger
- Lenis (smooth scroll)

### Steps

1. **Set up Lenis**
```js
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({ lerp: 0.1 })
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

2. **Create GSAP timeline with ScrollTrigger**
```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  }
})
```

3. **Animate camera on timeline**
```js
tl.to(camera.position, { z: -10, duration: 1 }, 0)
  .to(camera.rotation, { y: Math.PI * 0.5, duration: 1 }, 0.5)
```

4. **Sync render loop with Lenis**
```js
lenis.on('scroll', () => {
  // optional: pass scroll velocity to shaders
  material.uniforms.uScroll.value = lenis.scroll
})
```

5. **Add UI text reveals synced to scroll**
```js
tl.from('.hero-text', { opacity: 0, y: 50 }, 0.3)
```

---

## Unicorn Embed in Next.js

**Goal:** Embed Unicorn scene in Next.js app with optimized loading.

### Steps

1. **Export from Unicorn**
   - In Unicorn: Export → Embed Code
   - Copy script tag and embed snippet

2. **Create component**
```jsx
// components/UnicornEmbed.jsx
'use client'
import { useEffect, useRef } from 'react'

export default function UnicornEmbed({ projectId }) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Load Unicorn SDK
    const script = document.createElement('script')
    script.src = 'https://cdn.unicorn.studio/v1.0/unicorn.min.js'
    script.async = true
    script.onload = () => {
      if (window.Unicorn && containerRef.current) {
        window.Unicorn.init({
          container: containerRef.current,
          projectId,
        })
      }
    }
    document.body.appendChild(script)
    return () => script.remove()
  }, [projectId])

  return <div ref={containerRef} className="w-full h-screen" />
}
```

3. **Use in page**
```jsx
import UnicornEmbed from '@/components/UnicornEmbed'

export default function HeroSection() {
  return (
    <section className="relative">
      <UnicornEmbed projectId="your-project-id" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1>Your Content Here</h1>
      </div>
    </section>
  )
}
```

4. **Performance tips**
   - Lazy load with `dynamic()` and `ssr: false`
   - Use Intersection Observer to pause when off-screen
   - Consider reduced motion preference

---

## Custom Shader + GSAP Integration

**Goal:** Drive shader uniforms from GSAP timeline for synced visual transitions.

### Steps

1. **Define shader with uniforms**
```glsl
// fragment.glsl
uniform float uProgress;
uniform float uIntensity;

void main() {
  vec2 uv = vUv;
  // distortion based on progress
  uv.x += sin(uv.y * 10.0 + uProgress * 6.28) * uIntensity * 0.1;
  gl_FragColor = texture2D(uTexture, uv);
}
```

2. **Create material with uniforms**
```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    uProgress: { value: 0 },
    uIntensity: { value: 0 },
    uTexture: { value: texture }
  },
  vertexShader,
  fragmentShader
})
```

3. **Animate uniforms with GSAP**
```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#section',
    scrub: 1
  }
})

tl.to(material.uniforms.uProgress, { value: 1, duration: 1 })
  .to(material.uniforms.uIntensity, { value: 1, duration: 0.5 }, 0)
```

4. **Update in render loop**
```js
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
```

---

## Unicorn Effect → Three.js Translation

**Goal:** Replicate Unicorn effect in custom Three.js code.

### Effect Mapping

| Unicorn Effect | Three.js Implementation |
|----------------|------------------------|
| **Blur** | EffectComposer + UnrealBloomPass or custom Gaussian |
| **Distortion** | Custom vertex/fragment shader with displacement |
| **Glow** | UnrealBloomPass or emissive material |
| **Color Grade** | ColorCorrectionShader in post-processing |
| **Noise/Grain** | Film grain shader in EffectComposer |
| **Rim Light** | Fresnel calculation in fragment shader |

### Example: Distortion Wave

**Unicorn:** Distortion → Wave effect with intensity 0.5

**Three.js:**
```glsl
// vertex.glsl
uniform float uTime;
uniform float uIntensity;

void main() {
  vec3 pos = position;
  pos.z += sin(pos.x * 4.0 + uTime) * uIntensity;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### Example: Fresnel Rim Glow

**Unicorn:** Lighting → Rim Light

**Three.js:**
```glsl
// fragment.glsl
uniform vec3 uRimColor;
uniform float uRimPower;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), uRimPower);
  vec3 color = baseColor + uRimColor * fresnel;
  gl_FragColor = vec4(color, 1.0);
}
```

---

## Best Practices

1. **Performance**
   - Use `requestAnimationFrame` with Lenis delta
   - Throttle scroll handlers
   - Pause animations when off-screen

2. **Mobile**
   - Reduce effect intensity on mobile
   - Use lower-res textures
   - Consider static fallback for low-power devices

3. **Accessibility**
   - Respect `prefers-reduced-motion`
   - Ensure content readable without effects
   - Provide pause controls for motion-heavy sections
