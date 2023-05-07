<script>
	import SuccessMsg from '$lib/smallcomponents/successMsg.svelte';
	import FailedMsg from '$lib/smallcomponents/failedMsg.svelte';
	let test;

	let on = false;
</script>

<main class="flex justify-start items-center p-4">
	{#if on === true}
		<FailedMsg msg={'Somebody said they saw you'} />
	{/if}

	<button class="toggle" on:click={() => (on = !on)}>TOGGLE</button>
</main>

<style>
</style>
