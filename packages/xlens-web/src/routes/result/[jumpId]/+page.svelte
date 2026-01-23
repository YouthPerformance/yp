<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { JumpResult, VerificationTier } from '$lib';

	// Get jump ID from URL
	let jumpId = $derived($page.params.jumpId);

	// Result state
	let result: JumpResult | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	// Fetch result on mount
	onMount(() => {
		fetchResult().then(() => {
			// Poll for updates if still processing
			if (result && result.status !== 'complete') {
				pollInterval = setInterval(async () => {
					await fetchResult();
					if (result?.status === 'complete') {
						if (pollInterval) clearInterval(pollInterval);
					}
				}, 3000);
			}
		});

		return () => {
			if (pollInterval) clearInterval(pollInterval);
		};
	});

	async function fetchResult() {
		try {
			// TODO: Replace with actual Convex call
			const response = await fetch(`/api/jumps/${jumpId}`);
			if (response.ok) {
				result = await response.json();
			} else {
				error = 'Failed to load result';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}

	// Tier badge colors
	function getTierColor(tier: VerificationTier): string {
		switch (tier) {
			case 'gold':
				return 'bg-yellow-500';
			case 'silver':
				return 'bg-gray-400';
			case 'bronze':
				return 'bg-amber-600';
			case 'measured':
				return 'bg-blue-500';
			default:
				return 'bg-red-500';
		}
	}

	function getTierLabel(tier: VerificationTier): string {
		switch (tier) {
			case 'gold':
				return 'Gold Verified';
			case 'silver':
				return 'Silver Verified';
			case 'bronze':
				return 'Bronze Verified';
			case 'measured':
				return 'Measured';
			default:
				return 'Rejected';
		}
	}
</script>

<div class="min-h-screen bg-yp-dark p-6">
	<div class="max-w-md mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<button onclick={() => goto('/')} aria-label="Go back" class="p-2 -ml-2 text-white/60 hover:text-white">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<h1 class="text-xl font-semibold">Jump Result</h1>
			<div class="w-10"></div>
		</div>

		{#if loading}
			<!-- Loading State -->
			<div class="flex flex-col items-center justify-center py-20">
				<div
					class="w-12 h-12 border-2 border-yp-primary/30 border-t-yp-primary rounded-full animate-spin"
				></div>
				<p class="mt-4 text-white/60">Loading result...</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="text-center py-20">
				<div class="text-yp-error text-lg mb-2">Error</div>
				<p class="text-white/60">{error}</p>
				<button onclick={() => goto('/capture')} class="btn-primary mt-6"> Try Again </button>
			</div>
		{:else if result}
			<!-- Result Card -->
			<div class="bg-white/5 rounded-2xl overflow-hidden">
				<!-- Video Thumbnail -->
				{#if result.thumbnailUrl}
					<div class="aspect-video bg-black/50">
						<img src={result.thumbnailUrl} alt="Jump thumbnail" class="w-full h-full object-cover" />
					</div>
				{:else}
					<div class="aspect-video bg-black/50 flex items-center justify-center">
						<div class="text-white/40">Processing video...</div>
					</div>
				{/if}

				<!-- Result Info -->
				<div class="p-6">
					<!-- Height Display -->
					{#if result.height}
						<div class="text-center mb-6">
							<div class="text-5xl font-bold text-yp-primary">
								{result.height.inches.toFixed(1)}"
							</div>
							<div class="text-white/60 mt-1">
								{result.height.centimeters.toFixed(1)} cm
							</div>
						</div>
					{:else if result.status === 'processing'}
						<div class="text-center mb-6">
							<div class="text-2xl text-white/60">Processing...</div>
							<div
								class="w-8 h-8 border-2 border-yp-primary/30 border-t-yp-primary rounded-full animate-spin mx-auto mt-4"
							></div>
						</div>
					{/if}

					<!-- Verification Badge -->
					<div class="flex justify-center mb-6">
						<div
							class="inline-flex items-center gap-2 px-4 py-2 rounded-full {getTierColor(
								result.verificationTier
							)}"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							<span class="font-semibold">{getTierLabel(result.verificationTier)}</span>
						</div>
					</div>

					<!-- Status -->
					{#if result.status === 'flagged'}
						<div class="bg-yp-warning/20 text-yp-warning rounded-lg p-4 mb-4">
							<p class="font-semibold">Flagged for Review</p>
							<p class="text-sm mt-1">
								{result.flags?.join(', ') || 'This jump requires manual verification.'}
							</p>
						</div>
					{/if}

					<!-- Jump ID -->
					<div class="text-center text-sm text-white/40">
						Jump ID: {result.jumpId.slice(0, 8)}
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="mt-8 space-y-3">
				<button onclick={() => goto('/capture')} class="btn-primary w-full"> Try Another Jump </button>

				{#if result.videoUrl}
					<a href={result.videoUrl} target="_blank" class="btn-secondary w-full block text-center">
						View Full Video
					</a>
				{/if}
			</div>
		{/if}
	</div>
</div>
