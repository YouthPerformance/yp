<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		type UserCalibration,
		DEFAULT_SETUP_GUIDANCE,
		feetInchesToTotalInches
	} from '$lib/types';

	// Form state
	let heightFeet = $state(5);
	let heightInches = $state(10);
	let cameraDistance = $state(8);
	let currentStep = $state<'height' | 'setup' | 'ready'>('height');

	// Derived values
	let totalHeightInches = $derived(feetInchesToTotalInches(heightFeet, heightInches));
	let heightCm = $derived(Math.round(totalHeightInches * 2.54));

	// Height presets for quick selection
	const heightPresets = [
		{ label: "5'0\"", feet: 5, inches: 0 },
		{ label: "5'6\"", feet: 5, inches: 6 },
		{ label: "5'10\"", feet: 5, inches: 10 },
		{ label: "6'0\"", feet: 6, inches: 0 },
		{ label: "6'4\"", feet: 6, inches: 4 }
	];

	function selectPreset(feet: number, inches: number) {
		heightFeet = feet;
		heightInches = inches;
	}

	function nextStep() {
		if (currentStep === 'height') {
			currentStep = 'setup';
		} else if (currentStep === 'setup') {
			currentStep = 'ready';
		}
	}

	function prevStep() {
		if (currentStep === 'setup') {
			currentStep = 'height';
		} else if (currentStep === 'ready') {
			currentStep = 'setup';
		}
	}

	function startCapture() {
		// Store calibration data in sessionStorage for the capture page
		const calibration: UserCalibration = {
			heightInches: totalHeightInches,
			heightFeet,
			heightInchesRemainder: heightInches,
			cameraDistanceFeet: cameraDistance,
			cameraHeightPosition: 'hip'
		};

		if (browser) {
			sessionStorage.setItem('xlens_calibration', JSON.stringify(calibration));
		}

		goto('/capture');
	}
</script>

<div class="min-h-screen text-white flex flex-col relative overflow-hidden">
	<!-- Background Effects -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yp-cyan/5 rounded-full blur-[100px]"></div>
	</div>

	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0 relative z-10">
		<button onclick={() => goto('/')} class="p-2 text-white/60 hover:text-yp-cyan transition-colors">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<h1 class="font-bebas text-2xl tracking-wider">SETUP</h1>
		<div class="w-10"></div>
	</div>

	<!-- Progress Steps -->
	<div class="flex justify-center gap-3 py-4 relative z-10">
		{#each ['height', 'setup', 'ready'] as step, i}
			{@const stepIndex = ['height', 'setup', 'ready'].indexOf(currentStep)}
			{@const isActive = currentStep === step}
			{@const isPast = stepIndex > i}
			<div class="flex items-center gap-3">
				<div
					class="w-3 h-3 rounded-full transition-all duration-300 {isActive ? 'bg-yp-cyan shadow-glow-cyan' : ''} {isPast ? 'bg-yp-cyan/60' : ''} {!isActive && !isPast ? 'bg-white/20' : ''}"
				></div>
				{#if i < 2}
					<div class="w-8 h-px {stepIndex > i ? 'bg-yp-cyan/40' : 'bg-white/10'}"></div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Step Content -->
	<div class="flex-1 overflow-y-auto p-6 pb-28 relative z-10">
		<div class="max-w-md mx-auto">
			{#if currentStep === 'height'}
				<!-- Height Input Step -->
				<div class="text-center mb-8">
					<h2 class="font-bebas text-4xl tracking-wide mb-2">WHAT'S YOUR HEIGHT?</h2>
					<p class="text-white/50">We use this to calibrate the measurement</p>
				</div>

				<!-- Height Display -->
				<div class="glass-panel p-8 mb-8 text-center">
					<div class="font-bebas text-7xl tracking-wide text-gradient">
						{heightFeet}'{heightInches}"
					</div>
					<div class="text-white/40 mt-2 text-lg">{heightCm} cm</div>
				</div>

				<!-- Quick Presets -->
				<div class="flex flex-wrap justify-center gap-2 mb-8">
					{#each heightPresets as preset}
						{@const isSelected = heightFeet === preset.feet && heightInches === preset.inches}
						<button
							onclick={() => selectPreset(preset.feet, preset.inches)}
							class="px-5 py-2.5 rounded-xl font-bebas text-lg tracking-wider transition-all duration-200 
								   {isSelected ? 'bg-yp-cyan/20 border-yp-cyan text-yp-cyan shadow-glow-cyan' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'} border"
						>
							{preset.label}
						</button>
					{/each}
				</div>

				<!-- Fine Tune Sliders -->
				<div class="space-y-6 glass-card p-6">
					<div>
						<label class="block text-sm text-white/50 mb-3 font-medium tracking-wide">FEET</label>
						<input
							type="range"
							bind:value={heightFeet}
							min="4"
							max="7"
							step="1"
							class="slider-yp w-full"
						/>
						<div class="flex justify-between text-xs text-white/30 mt-2">
							<span>4'</span>
							<span>5'</span>
							<span>6'</span>
							<span>7'</span>
						</div>
					</div>

					<div>
						<label class="block text-sm text-white/50 mb-3 font-medium tracking-wide">INCHES</label>
						<input
							type="range"
							bind:value={heightInches}
							min="0"
							max="11"
							step="1"
							class="slider-yp w-full"
						/>
						<div class="flex justify-between text-xs text-white/30 mt-2">
							<span>0"</span>
							<span>3"</span>
							<span>6"</span>
							<span>9"</span>
							<span>11"</span>
						</div>
					</div>
				</div>

			{:else if currentStep === 'setup'}
				<!-- Camera Setup Step -->
				<div class="text-center mb-6">
					<h2 class="font-bebas text-4xl tracking-wide mb-2">CAMERA SETUP</h2>
					<p class="text-white/50">Follow these steps for best accuracy</p>
				</div>

				<!-- Setup Instructions -->
				<div class="space-y-3 mb-6">
					<div class="flex items-start gap-4 glass-card p-4">
						<div class="step-indicator">1</div>
						<div>
							<h3 class="font-semibold text-sm">Distance: 5-6 feet</h3>
							<p class="text-xs text-white/50 mt-1">{DEFAULT_SETUP_GUIDANCE.distanceRecommendation}</p>
						</div>
					</div>

					<div class="flex items-start gap-4 glass-card p-4">
						<div class="step-indicator">2</div>
						<div>
							<h3 class="font-semibold text-sm">Camera Height: Hip Level</h3>
							<p class="text-xs text-white/50 mt-1">{DEFAULT_SETUP_GUIDANCE.orientationRecommendation}</p>
						</div>
					</div>

					<div class="flex items-start gap-4 glass-card p-4">
						<div class="step-indicator">3</div>
						<div>
							<h3 class="font-semibold text-sm">Good Lighting</h3>
							<p class="text-xs text-white/50 mt-1">{DEFAULT_SETUP_GUIDANCE.lightingRecommendation}</p>
						</div>
					</div>

					<div class="flex items-start gap-4 glass-card p-4">
						<div class="step-indicator">4</div>
						<div>
							<h3 class="font-semibold text-sm">Full Body Visible</h3>
							<p class="text-xs text-white/50 mt-1">{DEFAULT_SETUP_GUIDANCE.positioningRecommendation}</p>
						</div>
					</div>
				</div>

				<!-- Visual Guide -->
				<div class="glass-panel p-4">
					<div class="aspect-video bg-black/30 rounded-xl flex items-center justify-center relative overflow-hidden">
						<svg viewBox="0 0 200 100" class="w-full h-full">
							<line x1="0" y1="85" x2="200" y2="85" stroke="rgba(0, 246, 224, 0.2)" stroke-width="1"/>
							<rect x="10" y="50" width="20" height="30" rx="3" fill="rgba(0, 246, 224, 0.4)"/>
							<circle cx="20" cy="60" r="4" fill="rgba(0, 246, 224, 0.8)"/>
							<line x1="35" y1="65" x2="100" y2="65" stroke="rgba(0, 246, 224, 0.3)" stroke-width="1" stroke-dasharray="4"/>
							<text x="67" y="60" fill="rgba(0, 246, 224, 0.6)" font-size="8" text-anchor="middle">5-6 ft</text>
							<circle cx="140" cy="30" r="8" fill="rgba(0, 246, 224, 0.6)"/>
							<line x1="140" y1="38" x2="140" y2="65" stroke="rgba(0, 246, 224, 0.6)" stroke-width="3"/>
							<line x1="140" y1="45" x2="125" y2="55" stroke="rgba(0, 246, 224, 0.6)" stroke-width="3"/>
							<line x1="140" y1="45" x2="155" y2="55" stroke="rgba(0, 246, 224, 0.6)" stroke-width="3"/>
							<line x1="140" y1="65" x2="130" y2="85" stroke="rgba(0, 246, 224, 0.6)" stroke-width="3"/>
							<line x1="140" y1="65" x2="150" y2="85" stroke="rgba(0, 246, 224, 0.6)" stroke-width="3"/>
							<line x1="170" y1="22" x2="170" y2="85" stroke="rgba(0, 246, 224, 0.3)" stroke-width="1" stroke-dasharray="3"/>
							<text x="180" y="55" fill="rgba(0, 246, 224, 0.6)" font-size="7">{heightFeet}'{heightInches}"</text>
						</svg>
					</div>
				</div>

			{:else if currentStep === 'ready'}
				<!-- Ready to Record Step -->
				<div class="text-center mb-6">
					<div class="w-20 h-20 rounded-full bg-yp-cyan/10 flex items-center justify-center mx-auto mb-4 border border-yp-cyan/30 animate-glow">
						<svg class="w-10 h-10 text-yp-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="font-bebas text-4xl tracking-wide mb-2">READY TO JUMP!</h2>
					<p class="text-white/50">Here's what will happen next</p>
				</div>

				<!-- Recording Flow -->
				<div class="space-y-3 mb-6">
					<div class="flex items-center gap-4 glass-card p-4">
						<div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
							<div class="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
						</div>
						<p class="font-medium">Tap the record button</p>
					</div>

					<div class="flex items-center gap-4 glass-card p-4">
						<div class="w-10 h-10 rounded-full bg-yp-cyan/10 flex items-center justify-center flex-shrink-0 border border-yp-cyan/30">
							<span class="text-yp-cyan font-mono text-xs font-bold">A7B3</span>
						</div>
						<div>
							<p class="font-medium">Show the code to the camera</p>
							<p class="text-xs text-white/50">Hold it visible for verification</p>
						</div>
					</div>

					<div class="flex items-center gap-4 glass-card p-4">
						<div class="step-indicator">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
							</svg>
						</div>
						<div>
							<p class="font-medium">Stand still, then JUMP!</p>
							<p class="text-xs text-white/50">Max effort vertical jump</p>
						</div>
					</div>

					<div class="flex items-center gap-4 glass-card p-4">
						<div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
							<div class="w-5 h-5 rounded bg-white/80"></div>
						</div>
						<p class="font-medium">Tap stop when you land</p>
					</div>
				</div>

				<!-- Your Height Reminder -->
				<div class="glass-panel p-4 border-yp-cyan/20">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-xs text-white/50 uppercase tracking-wider">Your height</p>
							<p class="font-bebas text-2xl tracking-wide text-yp-cyan">{heightFeet}'{heightInches}" <span class="text-white/40 text-lg">({heightCm} cm)</span></p>
						</div>
						<button onclick={() => currentStep = 'height'} class="text-sm text-yp-cyan hover:text-yp-cyan/80 transition-colors">
							Edit
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Fixed Bottom Buttons -->
	<div class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-yp-darker via-yp-darker/95 to-transparent z-20">
		<div class="max-w-md mx-auto">
			{#if currentStep === 'height'}
				<button onclick={nextStep} class="btn-primary w-full">
					CONTINUE
				</button>
			{:else if currentStep === 'setup'}
				<div class="flex gap-4">
					<button onclick={prevStep} class="btn-secondary flex-1">
						BACK
					</button>
					<button onclick={nextStep} class="btn-primary flex-1">
						CONTINUE
					</button>
				</div>
			{:else if currentStep === 'ready'}
				<div class="flex gap-4">
					<button onclick={prevStep} class="btn-secondary flex-1">
						BACK
					</button>
					<button onclick={startCapture} class="btn-primary flex-1">
						START RECORDING
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Custom slider styling */
	.slider-yp {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		outline: none;
	}

	.slider-yp::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		background: linear-gradient(135deg, #00f6e0 0%, #00c4b4 100%);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 0 15px rgba(0, 246, 224, 0.4);
		transition: box-shadow 0.2s;
	}

	.slider-yp::-webkit-slider-thumb:hover {
		box-shadow: 0 0 25px rgba(0, 246, 224, 0.6);
	}

	.slider-yp::-moz-range-thumb {
		width: 24px;
		height: 24px;
		background: linear-gradient(135deg, #00f6e0 0%, #00c4b4 100%);
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: 0 0 15px rgba(0, 246, 224, 0.4);
	}
</style>
