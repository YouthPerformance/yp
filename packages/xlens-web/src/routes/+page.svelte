<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
	<!-- Background Glow Effects -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yp-cyan/5 rounded-full blur-[120px]"></div>
		<div class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-yp-cyan/3 rounded-full blur-[100px]"></div>
	</div>

	<div class="max-w-md w-full relative z-10">
		<!-- Logo Section -->
		<div class="text-center mb-10">
			<!-- YP Logo -->
			<div class="mb-6 flex justify-center">
				<img 
					src="/brand-assets/logos/primary/YP-LOGO.svg" 
					alt="Youth Performance" 
					class="h-12 w-auto opacity-80"
				/>
			</div>
			
			<!-- xLENS Title -->
			<h1 class="font-bebas text-6xl tracking-wider text-gradient mb-2">
				xLENS
			</h1>
			<p class="text-white/50 text-sm tracking-widest uppercase">
				AI-Verified Jump Measurement
			</p>
		</div>

		<!-- Glass Card -->
		<div class="glass-panel p-8 mb-8">
			<!-- Hero Text -->
			<h2 class="font-bebas text-3xl tracking-wide text-white text-center mb-3">
				Measure Your Vertical
			</h2>
			<p class="text-white/60 text-center mb-8 leading-relaxed">
				Record your jump with your phone. Get an accurate measurement powered by AI analysis.
			</p>

			<!-- How it works -->
			<div class="space-y-4 mb-8">
				<div class="flex items-center gap-4">
					<div class="step-indicator">1</div>
					<span class="text-white/80">Enter your height for calibration</span>
				</div>
				<div class="flex items-center gap-4">
					<div class="step-indicator">2</div>
					<span class="text-white/80">Set up your camera 8-10 feet away</span>
				</div>
				<div class="flex items-center gap-4">
					<div class="step-indicator">3</div>
					<span class="text-white/80">Record your jump and get results</span>
				</div>
			</div>

			<!-- CTA Button -->
			<button onclick={() => goto('/setup')} class="btn-primary w-full">
				START JUMP TEST
			</button>
		</div>

		<!-- Footer Info -->
		<div class="text-center space-y-2">
			<p class="text-white/30 text-xs tracking-wider">
				Works on iOS Safari and Android Chrome
			</p>
			<div class="flex items-center justify-center gap-2 text-white/40 text-xs">
				<span>Powered by</span>
				<span class="text-yp-cyan/70">Gemini AI Vision</span>
			</div>
		</div>
	</div>
</div>
