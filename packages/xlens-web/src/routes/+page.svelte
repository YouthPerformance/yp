<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-6 text-center">
	<div class="max-w-md">
		<!-- Logo -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-yp-primary">xLENS</h1>
			<p class="text-white/60 mt-2">Verified Jump Capture</p>
		</div>

		<!-- Hero Text -->
		<h2 class="text-2xl font-semibold mb-4">Prove Your Jump</h2>
		<p class="text-white/70 mb-8">
			Record your vertical jump with cryptographic verification. No apps to download.
		</p>

		<!-- CTA Button -->
		<button onclick={() => goto('/capture')} class="btn-primary w-full text-lg">
			Start Jump Test
		</button>

		<!-- Info -->
		<div class="mt-12 text-sm text-white/50 space-y-2">
			<p>📱 Works on iOS Safari and Chrome</p>
			<p>🔒 Cryptographically verified</p>
			<p>⚡ No app download required</p>
		</div>
	</div>
</div>
