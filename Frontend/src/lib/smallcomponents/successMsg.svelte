<script>
	import { fly, fade } from 'svelte/transition';
	export let msg;
</script>

<div
	in:fly={{ y: 30 }}
	out:fade={{ duration: 1000 }}
	class="main flex justify-center items-center absolute bottom-5 h-8  p-1 border-2 border-amber-400 rounded-lg shadow-sm shadow-amber-400 bg-amber-400 bg-opacity-10 text-sm"
>
	<h1>{msg}</h1>
</div>

<style>
	.main {
		left: 42%;
		width: fit-content;
		cursor: pointer;
	}
</style>
