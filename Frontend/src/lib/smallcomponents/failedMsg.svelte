<script>
	import { fly, fade } from 'svelte/transition';
	export let msg;
</script>

<div
	in:fly={{ y: 30 }}
	out:fade={{ duration: 1000 }}
	class="main flex justify-center items-center absolute bottom-5 h-14  p-3 border-2 border-zinc-900 rounded-lg shadow-lg shadow-amber-400 bg-amber-400 text-black text-sm font-bold"
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
