<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Splash screen state
	let showSplash = $state(true);
	let splashFading = $state(false);
	let videoLoaded = $state(false);

	onMount(() => {
		if (!browser) return;

		// Check if user has seen splash before (this session)
		const hasSeenSplash = sessionStorage.getItem('xlens-splash-seen');

		if (hasSeenSplash) {
			showSplash = false;
			return;
		}

		// Auto-dismiss after video or timeout
		const timeout = setTimeout(() => {
			dismissSplash();
		}, 3500); // Max 3.5 seconds

		return () => clearTimeout(timeout);
	});

	function onVideoLoaded() {
		videoLoaded = true;
	}

	function onVideoEnded() {
		dismissSplash();
	}

	function dismissSplash() {
		if (!showSplash) return;

		splashFading = true;
		sessionStorage.setItem('xlens-splash-seen', 'true');

		setTimeout(() => {
			showSplash = false;
		}, 500); // Match fade duration
	}
</script>

<svelte:head>
	<title>xLENS - AI-Verified Jump Measurement | Youth Performance</title>
	<meta name="description" content="Measure your vertical jump with AI-powered precision. Record, analyze, and track your athletic performance with xLENS by Youth Performance." />
	<meta name="theme-color" content="#0a0a0a" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

	<!-- PWA/iOS -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>

<!-- Splash Screen -->
{#if showSplash}
	<div
		class="fixed inset-0 z-[9999] bg-yp-darker flex flex-col items-center justify-center transition-opacity duration-500"
		class:opacity-0={splashFading}
		class:pointer-events-none={splashFading}
		role="presentation"
	>
		<!-- Loader Video -->
		<div class="relative w-48 h-48 mb-8">
			<video
				autoplay
				muted
				playsinline
				onloadeddata={onVideoLoaded}
				onended={onVideoEnded}
				class="w-full h-full object-contain"
			>
				<source src="/loadernew.webm" type="video/webm" />
				<source src="/loadernew.mp4" type="video/mp4" />
			</video>

			<!-- Fallback spinner if video doesn't load -->
			{#if !videoLoaded}
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="w-16 h-16 border-2 border-yp-cyan/30 border-t-yp-cyan rounded-full animate-spin"></div>
				</div>
			{/if}
		</div>

		<!-- Brand -->
		<div class="text-center">
			<div class="font-bebas text-4xl tracking-[0.2em] text-yp-cyan glow-text mb-2">
				xLENS
			</div>
			<div class="text-white/40 text-sm tracking-wider">
				BY YOUTH PERFORMANCE
			</div>
		</div>

		<!-- Skip hint -->
		<button
			onclick={dismissSplash}
			class="absolute bottom-8 text-white/30 text-xs tracking-wide hover:text-white/50 transition-colors"
		>
			TAP TO SKIP
		</button>
	</div>
{/if}

<div class="min-h-screen">
	{@render children()}
</div>
