# Agent Learnings Wiki

> Lessons learned during development. Update via `/retro` or when discovering new patterns.

---

## Svelte 5 Gotchas

### Class Directive Parser Bugs

Svelte 5's `class:` directive cannot handle:

| Pattern | Problem | Fix |
|---------|---------|-----|
| `class:active={x > 5}` | `>` breaks parser | Use `{@const isActive = x > 5}` then `class:active={isActive}` |
| `class:selected={a <= b}` | `<=` breaks parser | Same - precompute in `{@const}` |
| `class="{condition ? 'bg-primary/20' : ''}"` | `/` in class names | Works fine with template strings |

**Wrong:**
```svelte
<div class:active={count > 0}>
```

**Right:**
```svelte
{@const isActive = count > 0}
<div class:active={isActive}>
```

### Runes and Reactivity

- Use `$state()` for reactive variables
- Use `$derived()` for computed values
- Use `$effect()` for side effects (like useEffect)
- Can use runes in `.svelte.ts` files (module context)

---

## Mobile Layout Patterns

### Fixed Bottom Buttons (Solved)

When content is scrollable but buttons need to stay visible:

```svelte
<div class="min-h-screen flex flex-col">
  <!-- Scrollable content -->
  <div class="flex-1 overflow-y-auto pb-24">
    <!-- Content here -->
  </div>

  <!-- Fixed buttons -->
  <div class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
    <button>Continue</button>
  </div>
</div>
```

Key elements:
- `pb-24` on content so it doesn't hide behind buttons
- `bg-gradient-to-t` for smooth visual fade
- `fixed bottom-0 left-0 right-0` for sticky positioning

---

## iOS Safari Specifics

### Camera Permission Requires User Gesture (Critical!)

**Error:** "The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission."

**Cause:** Calling `getUserMedia()` or camera APIs on page load (in `onMount`) without user interaction.

**Fix:** Add a button the user must tap first:

```svelte
let needsUserGesture = $state(true);

onMount(() => {
  // DON'T request camera here on iOS
  // Just check compatibility, create client
});

async function startCamera() {
  // This is called from button tap - now we can request camera
  needsUserGesture = false;
  await client.requestPermissions(); // Works because user tapped
}
```

**UI Pattern:**
- Show "Start Camera" button on initial load
- Only request `getUserMedia` after user taps
- Same applies to DeviceMotion on iOS 13+

### Camera Capture

- WebCodecs available on iOS 17+
- Always request camera with specific constraints
- MediaRecorder fallback for older devices (caps at 30fps)

### Motion Permissions

iOS requires explicit DeviceMotion permission request (also needs user gesture):
```typescript
if (typeof DeviceMotionEvent.requestPermission === 'function') {
  await DeviceMotionEvent.requestPermission();
}
```

---

## Convex Patterns

### HTTP Actions vs Mutations

- Use HTTP routes (`http.ts`) for external API calls
- Internal functions in separate file (`xlensHttp.ts`)
- Call internal functions with `ctx.runMutation(internal.file.function, args)`

### Storage URLs

```typescript
const videoUrl = await ctx.storage.getUrl(storageId);
// Returns signed URL, valid for limited time
```

---

## Video Upload Fixes

### Uint8Array to fetch Body

`Uint8Array` is not directly assignable to `BodyInit`. Convert to Blob:

**Wrong:**
```typescript
fetch(url, { body: capture.videoData }); // Type error
```

**Right:**
```typescript
const blob = new Blob([capture.videoData.buffer as ArrayBuffer], { type: 'video/mp4' });
fetch(url, { body: blob });
```

---

## Gemini API

### Model Names (as of Jan 2026)

| Version | Model ID |
|---------|----------|
| Gemini 3 Flash | `gemini-3-flash-preview` |
| Gemini 2 Flash | `gemini-2.0-flash-exp` |

### Video Analysis Endpoint

```typescript
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

fetch(`${url}?key=${apiKey}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: prompt },
        { fileData: { mimeType: "video/mp4", fileUri: videoUrl } }
      ]
    }],
    generationConfig: { temperature: 0.1 }
  })
});
```

---

## Vercel Deployment

### Monorepo Considerations

- Use GitHub integration, not CLI deploys
- CLI can't resolve `workspace:*` dependencies properly
- Set root directory to the specific app in Vercel settings

---

## UX Learnings

### Distance Recommendations

- 8-10 feet is too far for typical rooms
- 5-6 feet works better for home measurement
- User needs to see full body with headroom for jump

---

## Debugging Tips

### Check Convex Logs

```bash
npx convex logs --follow
```

### Environment Variables

Convex env vars are set via:
```bash
npx convex env set GOOGLE_AI_API_KEY "your-key"
```

---

## MediaPipe Pose Detection

### Setup with Svelte 5

```svelte
<script lang="ts">
import {
  PoseLandmarker,
  FilesetResolver,
  type PoseLandmarkerResult
} from '@mediapipe/tasks-vision';

let poseLandmarker = $state<PoseLandmarker | null>(null);
let poseAnimationId: number | null = null;

async function initPoseLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numPoses: 1
  });
}

function runPoseDetection() {
  if (!poseLandmarker || !videoElement) {
    poseAnimationId = requestAnimationFrame(runPoseDetection);
    return;
  }

  if (videoElement.readyState >= 2) {
    const results = poseLandmarker.detectForVideo(videoElement, performance.now());
    drawSkeleton(results);
  }

  poseAnimationId = requestAnimationFrame(runPoseDetection);
}
</script>
```

### Neon Glow Effect

Use canvas `shadowBlur` for glow:

```typescript
const NEON_COLOR = '#00f6e0';

ctx.shadowColor = NEON_COLOR;
ctx.shadowBlur = 20;
ctx.strokeStyle = NEON_COLOR;
ctx.lineWidth = 3;
```

### Key Points

- Use `pose_landmarker_lite` for mobile performance
- `delegate: 'GPU'` for hardware acceleration
- `runningMode: 'VIDEO'` for real-time detection
- Always cleanup: `cancelAnimationFrame(poseAnimationId)` and `poseLandmarker.close()`

---

*Last updated: 2026-01-25*
