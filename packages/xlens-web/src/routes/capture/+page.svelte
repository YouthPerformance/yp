<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		createXLensWebClient,
		type XLensWebClient,
		formatDuration,
		formatTimeRemaining
	} from '$lib';
	import type { UserCalibration } from '$lib/types';
	import {
		PoseLandmarker,
		FilesetResolver,
		DrawingUtils,
		type PoseLandmarkerResult
	} from '@mediapipe/tasks-vision';

	// Client state
	let client = $state<XLensWebClient | null>(null);
	let videoElement = $state<HTMLVideoElement | null>(null);
	let canvasElement = $state<HTMLCanvasElement | null>(null);
	let sessionTimer: ReturnType<typeof setInterval> | null = null;
	let sessionTimeRemaining = $state(120);
	let needsUserGesture = $state(true);

	// MediaPipe state
	let poseLandmarker = $state<PoseLandmarker | null>(null);
	let poseAnimationId: number | null = null;
	let showSkeleton = $state(true);
	let showMetrics = $state(true);

	// Metrics tracking
	let kneeAngle = $state(0);
	let hipHeight = $state(0);
	let baselineHipHeight = $state(0);
	let jumpPhase = $state<'READY' | 'LOAD' | 'EXPLODE' | 'FLIGHT' | 'LAND'>('READY');
	let peakJumpHeight = $state(0);
	let previousHipY = $state(0);
	let velocity = $state(0);

	// Calibration state
	let isCalibrated = $state(true);

	// Derived state
	let clientState = $derived(client?.state ?? 'idle');
	let session = $derived(client?.session ?? null);
	let error = $derived(client?.error ?? null);
	let recordingDuration = $derived(client?.recordingDuration ?? 0);
	let uploadProgress = $derived(client?.uploadProgress ?? null);
	let calibration = $derived(client?.calibration ?? null);

	// User height from calibration (default 70" = 5'10")
	let userHeightInches = $derived(calibration?.heightInches ?? 70);

	// Debug info
	let debugInfo = $state('');
	let convexUrl = $state('');

	// Neon glow color (#00f6e0 = yp-cyan)
	const NEON_COLOR = '#00f6e0';
	const NEON_GLOW_COLOR = 'rgba(0, 246, 224, 0.6)';

	// MediaPipe pose connections for skeleton
	const POSE_CONNECTIONS = [
		// Face
		[0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
		// Torso
		[9, 10], [11, 12], [11, 23], [12, 24], [23, 24],
		// Left arm
		[11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
		// Right arm
		[12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
		// Left leg
		[23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
		// Right leg
		[24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
	];

	// Calculate angle between three points
	function calculateAngle(
		a: { x: number; y: number },
		b: { x: number; y: number },
		c: { x: number; y: number }
	): number {
		const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
		let angle = Math.abs(radians * 180 / Math.PI);
		if (angle > 180) angle = 360 - angle;
		return angle;
	}

	// Detect jump phase based on hip position and velocity
	function detectJumpPhase(currentHipY: number, prevHipY: number): 'READY' | 'LOAD' | 'EXPLODE' | 'FLIGHT' | 'LAND' {
		const verticalVelocity = prevHipY - currentHipY; // Positive = moving up
		velocity = verticalVelocity * 100; // Scale for display

		// Set baseline on first detection
		if (baselineHipHeight === 0) {
			baselineHipHeight = currentHipY;
			return 'READY';
		}

		const heightDiff = baselineHipHeight - currentHipY;

		// Loading (crouching down)
		if (heightDiff < -0.02 && verticalVelocity < 0) {
			return 'LOAD';
		}

		// Exploding (rapid upward movement)
		if (verticalVelocity > 0.015) {
			return 'EXPLODE';
		}

		// Flight (above baseline, moving slowly)
		if (heightDiff > 0.03 && Math.abs(verticalVelocity) < 0.01) {
			// Track peak height
			if (heightDiff > peakJumpHeight) {
				peakJumpHeight = heightDiff;
			}
			return 'FLIGHT';
		}

		// Landing (coming down)
		if (verticalVelocity < -0.01 && heightDiff > 0) {
			return 'LAND';
		}

		return 'READY';
	}

	async function initPoseLandmarker() {
		try {
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
			console.log('[xLENS] PoseLandmarker initialized');
		} catch (e) {
			console.error('[xLENS] Failed to init PoseLandmarker:', e);
		}
	}

	function drawNeonSkeleton(results: PoseLandmarkerResult) {
		if (!canvasElement || !videoElement) return;

		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;

		// Match canvas size to video
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;

		// Clear canvas
		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

		if (!results.landmarks || results.landmarks.length === 0) return;

		const landmarks = results.landmarks[0];

		// Draw connections (skeleton lines) with neon glow
		ctx.save();

		// Outer glow layer
		ctx.shadowColor = NEON_COLOR;
		ctx.shadowBlur = 20;
		ctx.strokeStyle = NEON_GLOW_COLOR;
		ctx.lineWidth = 8;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		for (const [start, end] of POSE_CONNECTIONS) {
			const startLandmark = landmarks[start];
			const endLandmark = landmarks[end];

			if (startLandmark && endLandmark &&
				startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
				ctx.beginPath();
				ctx.moveTo(
					startLandmark.x * canvasElement.width,
					startLandmark.y * canvasElement.height
				);
				ctx.lineTo(
					endLandmark.x * canvasElement.width,
					endLandmark.y * canvasElement.height
				);
				ctx.stroke();
			}
		}

		// Inner bright line
		ctx.shadowBlur = 10;
		ctx.strokeStyle = NEON_COLOR;
		ctx.lineWidth = 3;

		for (const [start, end] of POSE_CONNECTIONS) {
			const startLandmark = landmarks[start];
			const endLandmark = landmarks[end];

			if (startLandmark && endLandmark &&
				startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
				ctx.beginPath();
				ctx.moveTo(
					startLandmark.x * canvasElement.width,
					startLandmark.y * canvasElement.height
				);
				ctx.lineTo(
					endLandmark.x * canvasElement.width,
					endLandmark.y * canvasElement.height
				);
				ctx.stroke();
			}
		}

		// Draw joint points with neon glow
		ctx.shadowBlur = 15;
		ctx.fillStyle = NEON_COLOR;

		for (const landmark of landmarks) {
			if (landmark.visibility > 0.5) {
				ctx.beginPath();
				ctx.arc(
					landmark.x * canvasElement.width,
					landmark.y * canvasElement.height,
					6,
					0,
					2 * Math.PI
				);
				ctx.fill();
			}
		}

		// White center for joints
		ctx.shadowBlur = 0;
		ctx.fillStyle = '#ffffff';

		for (const landmark of landmarks) {
			if (landmark.visibility > 0.5) {
				ctx.beginPath();
				ctx.arc(
					landmark.x * canvasElement.width,
					landmark.y * canvasElement.height,
					2,
					0,
					2 * Math.PI
				);
				ctx.fill();
			}
		}

		// Calculate and display metrics
		if (showMetrics) {
			// Key landmark indices: 23=left hip, 24=right hip, 25=left knee, 26=right knee, 27=left ankle, 28=right ankle
			const leftHip = landmarks[23];
			const rightHip = landmarks[24];
			const leftKnee = landmarks[25];
			const rightKnee = landmarks[26];
			const leftAnkle = landmarks[27];
			const rightAnkle = landmarks[28];

			// Calculate knee angle (using right leg as primary)
			if (rightHip?.visibility > 0.5 && rightKnee?.visibility > 0.5 && rightAnkle?.visibility > 0.5) {
				kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

				// Draw knee angle arc and label
				const kneeX = rightKnee.x * canvasElement.width;
				const kneeY = rightKnee.y * canvasElement.height;

				// Angle label
				ctx.save();
				ctx.shadowColor = NEON_COLOR;
				ctx.shadowBlur = 8;
				ctx.font = 'bold 14px "SF Mono", Monaco, monospace';
				ctx.fillStyle = NEON_COLOR;
				ctx.fillText(`${Math.round(kneeAngle)}°`, kneeX + 15, kneeY - 10);
				ctx.restore();
			}

			// Calculate hip height and detect jump phase
			if (leftHip?.visibility > 0.5 && rightHip?.visibility > 0.5) {
				const avgHipY = (leftHip.y + rightHip.y) / 2;
				jumpPhase = detectJumpPhase(avgHipY, previousHipY);
				previousHipY = avgHipY;
				hipHeight = avgHipY;
			}
		}

		ctx.restore();
	}

	function runPoseDetection() {
		if (!poseLandmarker || !videoElement || !showSkeleton) {
			poseAnimationId = requestAnimationFrame(runPoseDetection);
			return;
		}

		if (videoElement.readyState >= 2) {
			const results = poseLandmarker.detectForVideo(videoElement, performance.now());
			drawNeonSkeleton(results);
		}

		poseAnimationId = requestAnimationFrame(runPoseDetection);
	}

	function startPoseDetection() {
		if (poseAnimationId === null) {
			runPoseDetection();
		}
	}

	function stopPoseDetection() {
		if (poseAnimationId !== null) {
			cancelAnimationFrame(poseAnimationId);
			poseAnimationId = null;
		}
		if (canvasElement) {
			const ctx = canvasElement.getContext('2d');
			ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
		}
	}

	// Initialize on mount
	onMount(async () => {
		if (!browser) return;

		try {
			convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://your-app.convex.cloud';
			debugInfo = `Tap to start camera`;

			client = createXLensWebClient({
				convexUrl
			});

			const compatible = await client.checkCompatibility();
			if (!compatible) {
				debugInfo = 'Browser not compatible';
				needsUserGesture = false;
				return;
			}

			// Initialize MediaPipe PoseLandmarker
			await initPoseLandmarker();

			debugInfo = 'Tap "Start Camera" below';
		} catch (e) {
			debugInfo = `Error: ${e instanceof Error ? e.message : String(e)}`;
			console.error('xLENS init error:', e);
		}
	});

	onDestroy(() => {
		if (sessionTimer) clearInterval(sessionTimer);
		stopPoseDetection();
		poseLandmarker?.close();
		client?.reset();
	});

	async function startCamera() {
		if (!client) return;

		try {
			needsUserGesture = false;
			debugInfo = 'Requesting camera access...';

			const permitted = await client.requestPermissions();
			if (!permitted) {
				debugInfo = 'Camera permission denied. Please allow access.';
				needsUserGesture = true;
				return;
			}

			debugInfo = 'Connecting camera...';

			if (videoElement && client.getStream()) {
				videoElement.srcObject = client.getStream();
			}

			debugInfo = 'Creating session...';
			await client.createSession();
			debugInfo = 'Ready! Tap record when ready to jump';

			// Start skeleton pose detection
			startPoseDetection();

			sessionTimer = setInterval(() => {
				sessionTimeRemaining = Math.max(0, client?.getSessionTimeRemaining() ?? 0);
				if (sessionTimeRemaining <= 0 && session) {
					client?.createSession();
				}
			}, 1000);
		} catch (e) {
			debugInfo = `Error: ${e instanceof Error ? e.message : String(e)}`;
			needsUserGesture = true;
			console.error('Camera start error:', e);
		}
	}

	async function startRecording() {
		if (!client) return;
		// Reset metrics for new recording
		peakJumpHeight = 0;
		baselineHipHeight = 0;
		jumpPhase = 'READY';
		await client.startCapture();
	}

	async function stopRecording() {
		if (!client) return;
		const capture = await client.stopCapture();
		const result = await client.submitJump(capture);
		goto(`/result/${result.jumpId}`);
	}

	function cancel() {
		client?.cancel();
	}
</script>

<div class="relative min-h-screen bg-yp-darker">
	<!-- Video Preview -->
	<video
		bind:this={videoElement}
		autoplay
		playsinline
		muted
		class="absolute inset-0 w-full h-full object-cover video-preview"
	></video>

	<!-- Skeleton Overlay Canvas -->
	<canvas
		bind:this={canvasElement}
		class="absolute inset-0 w-full h-full object-cover pointer-events-none"
		style="z-index: 5;"
	></canvas>

	<!-- Metrics HUD Overlay -->
	{#if showSkeleton && showMetrics && session && clientState !== 'idle'}
		<div class="absolute top-20 left-4 right-4 pointer-events-none" style="z-index: 10;">
			<div class="flex justify-between items-start">
				<!-- Left side metrics -->
				<div class="space-y-2">
					<!-- Phase indicator -->
					<div class="glass-card px-3 py-2 inline-block">
						<div class="text-[10px] text-white/40 tracking-wider mb-1">PHASE</div>
						<div class="skeleton-phase text-lg">{jumpPhase}</div>
					</div>

					<!-- Knee angle -->
					{#if kneeAngle > 0}
						<div class="glass-card px-3 py-2 inline-block">
							<div class="text-[10px] text-white/40 tracking-wider mb-1">KNEE</div>
							<div class="text-xl font-mono text-yp-cyan glow-text">{Math.round(kneeAngle)}°</div>
						</div>
					{/if}
				</div>

				<!-- Right side metrics -->
				<div class="space-y-2 text-right">
					<!-- Velocity -->
					{#if Math.abs(velocity) > 0.5}
						<div class="glass-card px-3 py-2 inline-block">
							<div class="text-[10px] text-white/40 tracking-wider mb-1">VELOCITY</div>
							<div class="text-lg font-mono {velocity > 0 ? 'text-green-400' : 'text-red-400'}">
								{velocity > 0 ? '↑' : '↓'} {Math.abs(velocity).toFixed(1)}
							</div>
						</div>
					{/if}

					<!-- Peak height during recording -->
					{#if clientState === 'capturing' && peakJumpHeight > 0.02}
						<div class="glass-card px-3 py-2 inline-block">
							<div class="text-[10px] text-white/40 tracking-wider mb-1">PEAK</div>
							<div class="text-xl font-mono text-yp-cyan glow-text">
								{(peakJumpHeight * 100).toFixed(0)}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Overlay Container -->
	<div class="absolute inset-0 flex flex-col">
		<!-- Top Bar -->
		<div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
			<!-- Back Button -->
			<button onclick={() => goto('/setup')} aria-label="Go back" class="p-2 text-white/70 hover:text-yp-cyan transition-colors">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<!-- xLENS Badge + Toggles -->
			<div class="flex items-center gap-2">
				<div class="font-bebas text-lg tracking-wider text-yp-cyan/80">xLENS</div>
				{#if session && poseLandmarker}
					<!-- Skeleton toggle -->
					<button
						onclick={() => showSkeleton = !showSkeleton}
						aria-label="Toggle skeleton"
						class="p-1.5 rounded-full transition-all {showSkeleton ? 'bg-yp-cyan/20 text-yp-cyan' : 'bg-white/10 text-white/40'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</button>
					<!-- Metrics toggle -->
					<button
						onclick={() => showMetrics = !showMetrics}
						aria-label="Toggle metrics"
						class="p-1.5 rounded-full transition-all {showMetrics && showSkeleton ? 'bg-yp-cyan/20 text-yp-cyan' : 'bg-white/10 text-white/40'}"
						disabled={!showSkeleton}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</button>
				{/if}
			</div>

			<!-- Session Timer -->
			{#if session && clientState !== 'capturing'}
				<div
					class="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-sm font-mono border border-white/10"
					class:text-yp-warning={sessionTimeRemaining < 30}
					class:text-yp-error={sessionTimeRemaining < 10}
					class:animate-pulse={sessionTimeRemaining < 10}
				>
					{formatTimeRemaining(sessionTimeRemaining)}
				</div>
			{:else}
				<div class="w-16"></div>
			{/if}

			<!-- Recording Indicator -->
			{#if clientState === 'capturing'}
				<div class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/90 border border-red-400/50">
					<div class="recording-dot"></div>
					<span class="font-mono text-white font-medium">{formatDuration(recordingDuration)}</span>
				</div>
			{/if}
		</div>

		<!-- Center Content -->
		<div class="flex-1 flex flex-col items-center justify-center px-6">
			<!-- Start Camera Button (iOS requires user gesture) -->
			{#if needsUserGesture && clientState === 'idle'}
				<div class="text-center">
					<button
						onclick={startCamera}
						class="btn-action-circle mb-6"
					>
						<svg class="w-10 h-10 text-yp-darker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					</button>
					<p class="text-white/50 text-sm font-medium tracking-wide">TAP TO START CAMERA</p>
				</div>
			{/if}

			<!-- Nonce Display -->
			{#if session && clientState !== 'capturing' && isCalibrated}
				<div class="glass-panel px-8 py-4 animate-glow">
					<div class="nonce-overlay text-4xl font-bold text-yp-cyan tracking-[0.25em]">
						{session.nonceDisplay}
					</div>
				</div>
				<p class="mt-4 text-sm text-white/50 tracking-wide">Show this code in your video</p>
			{/if}

			<!-- State Messages -->
			{#if clientState === 'checking_compatibility'}
				<div class="text-white/60 font-medium">Checking browser compatibility...</div>
			{:else if clientState === 'requesting_permissions'}
				<div class="text-white/60 font-medium">Please allow camera access</div>
			{:else if clientState === 'preparing_session'}
				<div class="flex items-center gap-3">
					<div class="w-5 h-5 border-2 border-yp-cyan/30 border-t-yp-cyan rounded-full animate-spin"></div>
					<span class="text-white/60 font-medium">Preparing session...</span>
				</div>
			{:else if clientState === 'processing'}
				<div class="flex items-center gap-3">
					<div class="w-5 h-5 border-2 border-yp-cyan/30 border-t-yp-cyan rounded-full animate-spin"></div>
					<span class="text-white/60 font-medium">Processing video...</span>
				</div>
			{:else if clientState === 'uploading'}
				<div class="text-center glass-panel p-6">
					<div class="text-white/80 mb-4 font-bebas text-xl tracking-wide">UPLOADING</div>
					{#if uploadProgress}
						<div class="progress-bar w-56 mb-2">
							<div class="progress-fill" style="width: {uploadProgress.percentage}%"></div>
						</div>
						<div class="text-sm text-yp-cyan font-mono">{uploadProgress.percentage}%</div>
					{/if}
				</div>
			{:else if clientState === 'error'}
				<div class="text-center px-4 glass-panel p-6 max-w-sm">
					<div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
						<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<div class="text-yp-error font-bebas text-xl tracking-wide mb-2">ERROR</div>
					<div class="text-white/60 text-sm mb-4">{error?.message || 'Unknown error'}</div>
					<button onclick={() => { needsUserGesture = true; client?.reset(); }} class="btn-secondary">
						TRY AGAIN
					</button>
				</div>
			{:else if clientState === 'unsupported'}
				<div class="text-center max-w-xs glass-panel p-6">
					<div class="text-yp-error font-bebas text-xl tracking-wide mb-2">BROWSER NOT SUPPORTED</div>
					<div class="text-white/60">Please use Safari on iOS or Chrome on Android.</div>
				</div>
			{/if}
		</div>

		<!-- Bottom Controls -->
		<div class="p-6 bg-gradient-to-t from-black/70 to-transparent">
			<div class="flex items-center justify-center gap-6">
				{#if clientState === 'session_ready'}
					<!-- Record Button -->
					<button
						onclick={startRecording}
						disabled={!isCalibrated}
						aria-label="Start recording"
						class="w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-90
							   {isCalibrated
							   	? 'btn-action-circle cursor-pointer'
							   	: 'bg-white/10 cursor-not-allowed opacity-50 border border-white/20'}"
					>
						<div class="w-10 h-10 rounded-full bg-yp-darker"></div>
					</button>
				{:else if clientState === 'capturing'}
					<!-- Stop Button -->
					<button
						onclick={stopRecording}
						aria-label="Stop recording"
						class="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center
							   transition-all active:scale-90 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
					>
						<div class="w-10 h-10 rounded-md bg-white"></div>
					</button>
				{:else if ['checking_compatibility', 'requesting_permissions', 'preparing_session', 'processing', 'uploading'].includes(clientState)}
					<!-- Loading State -->
					<div class="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
						<div class="w-10 h-10 border-2 border-yp-cyan/30 border-t-yp-cyan rounded-full animate-spin"></div>
					</div>
				{/if}
			</div>

			<!-- Instructions -->
			{#if clientState === 'session_ready'}
				{#if !isCalibrated}
					<p class="text-center text-yp-warning mt-4 text-sm font-medium tracking-wide">
						Position yourself in the frame to unlock recording
					</p>
				{:else}
					<p class="text-center text-yp-cyan/80 mt-4 text-sm font-medium tracking-wide">
						TAP TO START RECORDING
					</p>
				{/if}
			{:else if clientState === 'capturing'}
				<p class="text-center text-white/50 mt-4 text-sm tracking-wide">Tap to stop when done</p>
			{/if}

			<!-- Calibration Status -->
			{#if calibration && clientState === 'session_ready'}
				<div class="mt-4 flex items-center justify-center gap-3 glass-card px-4 py-2 mx-auto w-fit">
					<div class="w-2 h-2 rounded-full {isCalibrated ? 'bg-yp-cyan shadow-glow-cyan' : 'bg-yp-warning'}"></div>
					<span class="text-white/60 text-sm">
						Height: <span class="text-white font-medium">{calibration.heightFeet}'{calibration.heightInchesRemainder}"</span>
						{#if isCalibrated}
							<span class="text-yp-cyan ml-1">(Locked)</span>
						{/if}
					</span>
					<button onclick={() => goto('/setup')} class="text-yp-cyan/70 hover:text-yp-cyan text-xs transition-colors">
						Edit
					</button>
				</div>
			{:else if clientState === 'session_ready'}
				<button
					onclick={() => goto('/setup')}
					class="mt-4 text-sm text-yp-cyan/70 hover:text-yp-cyan transition-colors block mx-auto"
				>
					Add your height for better accuracy
				</button>
			{/if}

			<!-- Debug Info -->
			{#if debugInfo}
				<div class="mt-4 text-xs text-white/30 font-mono text-center">
					{debugInfo}
				</div>
			{/if}
		</div>
	</div>
</div>
