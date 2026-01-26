<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { JumpResult, VerificationTier } from '$lib';

	// Get jump ID from URL
	let jumpId = $derived($page.params.jumpId);

	// Result state
	let result: JumpResult | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let pollInterval: ReturnType<typeof setInterval> | null = null;
	let convexUrl = '';

	// Animation states
	let showGeminiGlow = $state(true);
	let showResultReveal = $state(false);
	let snapAnimation = $state(false);

	// Scanning messages that cycle
	const scanMessages = [
		'Analyzing Biomechanics...',
		'Detecting Jump Phases...',
		'Calculating Vertical...',
		'Measuring Peak Height...',
		'Processing Motion Data...'
	];
	let currentMessageIndex = $state(0);
	let messageInterval: ReturnType<typeof setInterval> | null = null;

	// Fetch result on mount
	onMount(() => {
		if (!browser) return;

		// Get Convex URL and convert to HTTP endpoint
		const cloudUrl = import.meta.env.VITE_CONVEX_URL || '';
		convexUrl = cloudUrl.replace('.convex.cloud', '.convex.site');

		// Cycle scanning messages
		messageInterval = setInterval(() => {
			currentMessageIndex = (currentMessageIndex + 1) % scanMessages.length;
		}, 2000);

		// Start polling immediately
		pollInterval = setInterval(async () => {
			await fetchResult();
		}, 2000);

		// Also fetch immediately
		fetchResult();

		return () => {
			if (pollInterval) clearInterval(pollInterval);
			if (messageInterval) clearInterval(messageInterval);
		};
	});

	async function fetchResult() {
		try {
			const response = await fetch(`${convexUrl}/xlens/result`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ jumpId })
			});

			if (response.ok) {
				const data = await response.json();
				result = {
					jumpId: data.jumpId,
					userId: '',
					status: data.status,
					verificationTier: data.verificationTier,
					height: data.heightInches
						? {
								inches: data.heightInches,
								centimeters: data.heightCm || data.heightInches * 2.54
							}
						: undefined,
					videoUrl: data.videoUrl,
					thumbnailUrl: undefined,
					processedAt: data.processedAt ? new Date(data.processedAt) : undefined,
					flags: data.flags
				};

				// Stop polling when result is final
				if (data.status === 'complete' || data.status === 'failed') {
					if (pollInterval) {
						clearInterval(pollInterval);
						pollInterval = null;
					}
					if (messageInterval) {
						clearInterval(messageInterval);
						messageInterval = null;
					}

					// Trigger the snap animation then reveal
					if (data.status === 'complete' && showGeminiGlow) {
						snapAnimation = true;
						setTimeout(() => {
							showGeminiGlow = false;
							showResultReveal = true;
						}, 600); // Match snap animation duration
					} else {
						showGeminiGlow = false;
					}
				}
			} else {
				const errData = await response.json();
				error = errData.error || 'Failed to load result';
				if (pollInterval) {
					clearInterval(pollInterval);
					pollInterval = null;
				}
			}
		} catch (err) {
			error = 'Network error - please try again';
			console.error('[xLENS] Result fetch error:', err);
		} finally {
			loading = false;
		}
	}

	// Tier badge colors and styles
	function getTierStyles(tier: VerificationTier): { bg: string; text: string; glow: string } {
		switch (tier) {
			case 'gold':
				return { 
					bg: 'bg-gradient-to-r from-yellow-500 to-amber-400', 
					text: 'text-black',
					glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]'
				};
			case 'silver':
				return { 
					bg: 'bg-gradient-to-r from-gray-300 to-gray-400', 
					text: 'text-black',
					glow: 'shadow-[0_0_30px_rgba(156,163,175,0.3)]'
				};
			case 'bronze':
				return { 
					bg: 'bg-gradient-to-r from-amber-600 to-amber-500', 
					text: 'text-black',
					glow: 'shadow-[0_0_30px_rgba(217,119,6,0.3)]'
				};
			case 'measured':
				return { 
					bg: 'bg-gradient-to-r from-yp-cyan to-yp-cyan-dark', 
					text: 'text-black',
					glow: 'shadow-glow-cyan'
				};
			default:
				return { 
					bg: 'bg-red-500', 
					text: 'text-white',
					glow: ''
				};
		}
	}

	function getTierLabel(tier: VerificationTier): string {
		switch (tier) {
			case 'gold': return 'GOLD VERIFIED';
			case 'silver': return 'SILVER VERIFIED';
			case 'bronze': return 'BRONZE VERIFIED';
			case 'measured': return 'MEASURED';
			default: return 'REJECTED';
		}
	}
</script>

<div class="min-h-screen p-6 relative overflow-hidden">
	<!-- Gemini Glow Effect (during processing) -->
	{#if (result?.status === 'processing' || loading) && showGeminiGlow}
		<div class="gemini-glow-container" class:gemini-snap={snapAnimation}>
			<!-- Racing perimeter glow -->
			<div class="gemini-perimeter"></div>

			<!-- Inner pulse -->
			<div class="gemini-inner-glow"></div>

			<!-- Corner accents -->
			<div class="gemini-corner gemini-corner-tl"></div>
			<div class="gemini-corner gemini-corner-tr"></div>
			<div class="gemini-corner gemini-corner-bl"></div>
			<div class="gemini-corner gemini-corner-br"></div>

			<!-- Scanning line -->
			<div class="gemini-scan-line"></div>
		</div>
	{/if}

	<!-- Background Effects -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yp-cyan/5 rounded-full blur-[120px]"></div>
	</div>

	<div class="max-w-md mx-auto relative z-10">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<button onclick={() => goto('/')} aria-label="Go back" class="p-2 -ml-2 text-white/60 hover:text-yp-cyan transition-colors">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<h1 class="font-bebas text-2xl tracking-wider">JUMP RESULT</h1>
			<div class="w-10"></div>
		</div>

		{#if loading}
			<!-- Loading State -->
			<div class="flex flex-col items-center justify-center py-20">
				<div class="w-16 h-16 relative">
					<div class="absolute inset-0 rounded-full border-2 border-yp-cyan/20"></div>
					<div class="absolute inset-0 rounded-full border-2 border-transparent border-t-yp-cyan animate-spin"></div>
				</div>
				<p class="mt-6 text-white/50">Loading result...</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="text-center py-20">
				<div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
					<svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<p class="text-white/60 mb-6">{error}</p>
				<button onclick={() => goto('/capture')} class="btn-primary">TRY AGAIN</button>
			</div>
		{:else if result}
			<!-- Result Card -->
			<div class="glass-panel overflow-hidden">
				<!-- Video Thumbnail -->
				{#if result.thumbnailUrl}
					<div class="aspect-video bg-black/50">
						<img src={result.thumbnailUrl} alt="Jump thumbnail" class="w-full h-full object-cover" />
					</div>
				{:else if result.status !== 'processing'}
					<div class="aspect-video bg-black/30 flex items-center justify-center border-b border-white/5">
						<div class="text-center">
							<svg class="w-12 h-12 text-yp-cyan/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							<p class="text-white/30 text-sm">Video captured</p>
						</div>
					</div>
				{/if}

				<!-- Result Info -->
				<div class="p-8">
					<!-- Height Display -->
					{#if result.height}
						<div class="text-center mb-8" class:result-reveal={showResultReveal}>
							<div class="result-number">
								{result.height.inches.toFixed(1)}
							</div>
							<div class="result-unit mt-1">INCHES</div>
							<div class="text-white/40 mt-2 text-lg">
								{result.height.centimeters.toFixed(1)} cm
							</div>
						</div>
					{:else if result.status === 'processing'}
						<div class="text-center mb-8 py-8">
							<!-- Pulsing scan icon -->
							<div class="w-24 h-24 relative mx-auto mb-8">
								<div class="absolute inset-0 rounded-full border-2 border-yp-cyan/30"></div>
								<div class="absolute inset-0 rounded-full border-2 border-transparent border-t-yp-cyan animate-spin" style="animation-duration: 1s;"></div>
								<div class="absolute inset-2 rounded-full border border-yp-cyan/20"></div>
								<div class="absolute inset-4 rounded-full bg-yp-cyan/10 animate-pulse"></div>
								<!-- Center icon -->
								<div class="absolute inset-0 flex items-center justify-center">
									<svg class="w-10 h-10 text-yp-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
							</div>

							<!-- Cycling message -->
							<div class="font-bebas text-2xl tracking-widest text-yp-cyan mb-3 glow-text">
								{scanMessages[currentMessageIndex].toUpperCase()}
							</div>

							<!-- Sub-message -->
							<div class="text-sm text-white/40 tracking-wide">
								xLENS AI Processing
							</div>

							<!-- Fake progress dots -->
							<div class="flex items-center justify-center gap-2 mt-6">
								<div class="w-2 h-2 rounded-full bg-yp-cyan animate-pulse" style="animation-delay: 0ms;"></div>
								<div class="w-2 h-2 rounded-full bg-yp-cyan animate-pulse" style="animation-delay: 200ms;"></div>
								<div class="w-2 h-2 rounded-full bg-yp-cyan animate-pulse" style="animation-delay: 400ms;"></div>
							</div>
						</div>
					{:else if result.status === 'failed'}
						<div class="text-center mb-8 py-4">
							<div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
								<svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<div class="font-bebas text-3xl tracking-wide text-white mb-2">ANALYSIS FAILED</div>
							<div class="text-sm text-white/50">
								{result.flags?.join(', ') || 'Could not process the video'}
							</div>
						</div>
					{/if}

					<!-- Verification Badge -->
					{#if result.status === 'complete' || result.height}
						{@const tierStyles = getTierStyles(result.verificationTier)}
						<div class="flex justify-center mb-6">
							<div class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bebas tracking-wider {tierStyles.bg} {tierStyles.text} {tierStyles.glow}">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
								</svg>
								<span>{getTierLabel(result.verificationTier)}</span>
							</div>
						</div>
					{/if}

					<!-- Status Flags -->
					{#if result.status === 'flagged'}
						<div class="bg-yp-warning/10 border border-yp-warning/30 rounded-xl p-4 mb-6">
							<p class="font-semibold text-yp-warning">Flagged for Review</p>
							<p class="text-sm text-white/60 mt-1">
								{result.flags?.join(', ') || 'This jump requires manual verification.'}
							</p>
						</div>
					{/if}

					<!-- Jump ID -->
					<div class="text-center text-sm text-white/30 font-mono">
						ID: {result.jumpId.slice(0, 8)}
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="mt-8 space-y-3">
				<button onclick={() => goto('/capture')} class="btn-primary w-full">
					TRY ANOTHER JUMP
				</button>

				{#if result.videoUrl}
					<a href={result.videoUrl} target="_blank" class="btn-secondary w-full block text-center">
						VIEW FULL VIDEO
					</a>
				{/if}

				<button onclick={() => goto('/')} class="btn-ghost w-full">
					Back to Home
				</button>
			</div>
		{/if}
	</div>
</div>
