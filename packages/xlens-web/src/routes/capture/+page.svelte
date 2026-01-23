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

	// Client state - use generic $state for proper type inference
	let client = $state<XLensWebClient | null>(null);
	let videoElement = $state<HTMLVideoElement | null>(null);
	let sessionTimer: ReturnType<typeof setInterval> | null = null;
	let sessionTimeRemaining = $state(120);

	// Derived state - explicit types to avoid circular inference
	let clientState = $derived(client?.state ?? 'idle');
	let session = $derived(client?.session ?? null);
	let error = $derived(client?.error ?? null);
	let recordingDuration = $derived(client?.recordingDuration ?? 0);
	let uploadProgress = $derived(client?.uploadProgress ?? null);

	// Initialize on mount
	onMount(async () => {
		if (!browser) return;

		// Create client
		client = createXLensWebClient({
			convexUrl: import.meta.env.VITE_CONVEX_URL || 'https://your-app.convex.cloud',
			userId: 'demo_user' // TODO: Get from auth
		});

		// Check compatibility
		const compatible = await client.checkCompatibility();
		if (!compatible) return;

		// Request permissions
		const permitted = await client.requestPermissions();
		if (!permitted) return;

		// Connect video preview
		if (videoElement && client.getStream()) {
			videoElement.srcObject = client.getStream();
		}

		// Create session
		await client.createSession();

		// Start session countdown
		sessionTimer = setInterval(() => {
			sessionTimeRemaining = Math.max(0, client?.getSessionTimeRemaining() ?? 0);
			if (sessionTimeRemaining <= 0 && session) {
				// Session expired, create new one
				client?.createSession();
			}
		}, 1000);
	});

	onDestroy(() => {
		if (sessionTimer) clearInterval(sessionTimer);
		client?.reset();
	});

	// Actions
	async function startRecording() {
		if (!client) return;
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

<div class="relative min-h-screen bg-black">
	<!-- Video Preview -->
	<video
		bind:this={videoElement}
		autoplay
		playsinline
		muted
		class="absolute inset-0 w-full h-full object-cover video-preview"
	></video>

	<!-- Overlay Container -->
	<div class="absolute inset-0 flex flex-col">
		<!-- Top Bar -->
		<div class="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
			<!-- Back Button -->
			<button onclick={() => goto('/')} aria-label="Go back" class="p-2 text-white/80 hover:text-white">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<!-- Session Timer -->
			{#if session && clientState !== 'capturing'}
				<div
					class="px-3 py-1 rounded-full bg-black/40 text-sm font-mono"
					class:timer-warning={sessionTimeRemaining < 30}
					class:timer-critical={sessionTimeRemaining < 10}
				>
					Session: {formatTimeRemaining(sessionTimeRemaining)}
				</div>
			{/if}

			<!-- Recording Indicator -->
			{#if clientState === 'capturing'}
				<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/80">
					<div class="recording-dot"></div>
					<span class="font-mono">{formatDuration(recordingDuration)}</span>
				</div>
			{/if}
		</div>

		<!-- Center Content -->
		<div class="flex-1 flex flex-col items-center justify-center">
			<!-- Nonce Display -->
			{#if session && clientState !== 'capturing'}
				<div class="nonce-overlay text-4xl font-bold text-white/90 bg-black/40 px-6 py-3 rounded-2xl">
					{session.nonceDisplay}
				</div>
				<p class="mt-2 text-sm text-white/60">Show this code in your video</p>
			{/if}

			<!-- State Messages -->
			{#if clientState === 'checking_compatibility'}
				<div class="text-white/80">Checking browser compatibility...</div>
			{:else if clientState === 'requesting_permissions'}
				<div class="text-white/80">Please allow camera access</div>
			{:else if clientState === 'preparing_session'}
				<div class="text-white/80">Preparing session...</div>
			{:else if clientState === 'processing'}
				<div class="text-white/80">Processing video...</div>
			{:else if clientState === 'uploading'}
				<div class="text-center">
					<div class="text-white/80 mb-2">Uploading...</div>
					{#if uploadProgress}
						<div class="progress-bar w-48">
							<div class="progress-fill" style="width: {uploadProgress.percentage}%"></div>
						</div>
						<div class="text-sm text-white/60 mt-1">{uploadProgress.percentage}%</div>
					{/if}
				</div>
			{:else if clientState === 'error'}
				<div class="text-center">
					<div class="text-yp-error text-lg mb-2">Error</div>
					<div class="text-white/70">{error?.message}</div>
					<button onclick={() => client?.reset()} class="btn-secondary mt-4"> Try Again </button>
				</div>
			{:else if clientState === 'unsupported'}
				<div class="text-center max-w-xs">
					<div class="text-yp-error text-lg mb-2">Browser Not Supported</div>
					<div class="text-white/70">Please use Safari on iOS or Chrome on Android.</div>
				</div>
			{/if}
		</div>

		<!-- Bottom Controls -->
		<div class="p-6 bg-gradient-to-t from-black/50 to-transparent">
			<div class="flex items-center justify-center gap-6">
				{#if clientState === 'session_ready'}
					<!-- Record Button -->
					<button
						onclick={startRecording}
						aria-label="Start recording"
						class="w-20 h-20 rounded-full bg-yp-primary flex items-center justify-center
							   transition-transform active:scale-95 shadow-lg shadow-yp-primary/30"
					>
						<div class="w-8 h-8 rounded-full bg-white"></div>
					</button>
				{:else if clientState === 'capturing'}
					<!-- Stop Button -->
					<button
						onclick={stopRecording}
						aria-label="Stop recording"
						class="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center
							   transition-transform active:scale-95 shadow-lg shadow-red-500/30"
					>
						<div class="w-8 h-8 rounded bg-white"></div>
					</button>
				{:else if ['checking_compatibility', 'requesting_permissions', 'preparing_session', 'processing', 'uploading'].includes(clientState)}
					<!-- Loading State -->
					<div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
						<div class="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
					</div>
				{/if}
			</div>

			<!-- Instructions -->
			{#if clientState === 'session_ready'}
				<p class="text-center text-white/60 mt-4 text-sm">
					Tap to start recording. Show the code, then jump!
				</p>
			{:else if clientState === 'capturing'}
				<p class="text-center text-white/60 mt-4 text-sm">Tap to stop when done</p>
			{/if}
		</div>
	</div>
</div>
