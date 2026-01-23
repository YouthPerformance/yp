<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>xLENS - Verified Jump Capture</title>
</svelte:head>

<div class="min-h-screen bg-yp-dark text-yp-light">
	{@render children()}
</div>
