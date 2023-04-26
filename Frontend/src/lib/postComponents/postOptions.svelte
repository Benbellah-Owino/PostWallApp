<script>
	export let id;
	console.log(id);
</script>

<main
	id="postOptions"
	class="main absolute top-5 right-2 flex flex-col justify-start items-center w-52 h-60 z-50 m-4 bg-zinc-800 border border-amber-400 rounded shadow-md shadow-amber-400 "
>
	<div
		on:click|stopPropagation={() => window.open(`editPost?post_id=${id}`, '_self')}
		class="optionLink hover:bg-amber-100 hover:bg-opacity-10"
	>
		<h1 class="link">Edit tweet</h1>
	</div>

	<div class="optionLink hover:bg-red-300 hover:bg-opacity-25">
		<h1 class="link text-red-500">Delete tweet</h1>
	</div>

	<div class="optionLink hover:bg-amber-100 hover:bg-opacity-10">
		<h1 class="link">Save tweet tweet</h1>
	</div>
</main>

<style>
	.optionLink {
		width: 100%;
		padding-left: 4px;

		height: 30px;
		cursor: pointer;
	}

	.optionLink:hover > a {
		font-weight: 500;
		transition: all 0.1s ease-in-out;
	}
</style>
