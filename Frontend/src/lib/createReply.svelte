<script>
	import { identity } from 'svelte/internal';
	import { onMount } from 'svelte';
	let user = 'HelloWorld';

	let files = [];

	let isImage = false;

	let postArea;
	//let display;
	let pic;
	//let video;
	let userDetails;
	onMount(async () => {
		postArea = document.getElementById('txt_reply');
		//display = document.getElementById('display');
		pic = document.getElementById('content_pic');
		//video = document.getElementById('content_video');
	});

	function selectFile() {
		pic.style.display = 'flex';

		console.log(pic);
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*, video/*';
		input.onchange = () => {
			const file = input.files[0];
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				//console.log(reader.result);
				// display.style.backgroundImage = `url(${reader.result})`;
				pic.src = reader.result;

				files.push(file);
			});
			if (file) {
				reader.readAsDataURL(file);
			}
		};
		input.click();
	}
</script>

<svelte:head>
	<script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script>
</svelte:head>

<main class="border-b-2 border-amber-400 p-1 w-11/12">
	<h3 class="text-sm mb-1">Reply to @{user}</h3>
	<textarea
		type="text"
		name="reply"
		id="txt_reply"
		class="bg-zinc-700 w-11/12 ml-3 text-sm"
		cols="90"
		rows="4"
	/>

	<img
		src=""
		alt="post media"
		class="w-fit h-fit max-h-96 max-w-96 ml-28 hidden"
		id="content_pic"
	/>

	<div class="utilities mt-2 flex row flex-start items-center mb-2 w-9/12 p-1 pr-10 ">
		<div id="photos" class="ml-10 mr-24">
			<button
				class="w-7 h-7 bg-zinc-900 text-amber-400 border-2 rounded-xl border-amber-400 hover:bg-amber-400 hover:text-zinc-900 "
				on:click={selectFile}
			>
				<i class="fa fa-picture-o" aria-hidden="true" />
			</button>
		</div>

		<button
			class="submit bg-zinc-900 border border-amber-400 w-12 rounded-2xl p-1 hover:bg-amber-400 hover:text-zinc-900"
			id="submit">reply</button
		>
	</div>
</main>

<style>
</style>
