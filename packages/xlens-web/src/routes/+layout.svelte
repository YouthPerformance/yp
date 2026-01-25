<script lang="ts">
	import '../app.css';

	let { children } = $props();
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

<div class="min-h-screen">
	{@render children()}
</div>
