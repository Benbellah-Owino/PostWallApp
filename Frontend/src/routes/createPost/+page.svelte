<script>
	import { onMount } from 'svelte';
	import SuccessMsg from '$lib/smallcomponents/successMsg.svelte';

	let postArea;
	let files = [];
	let display;
	let pic;
	let video;
	let userDetails;

	let successMsg = false;

	let message = 'No message';
	onMount(async () => {
		postArea = document.getElementById('post_area');
		display = document.getElementById('display');
		pic = document.getElementById('content_pic');
		video = document.getElementById('content_video');
		try {
			await fetch('http://localhost:3000/api/v1/auth/userDetails', {
				credentials: 'include'
			})
				.then((response) => response.json())
				.then((data) => {
					let base64Url = data.details.split('.')[1];
					let decodedToken = JSON.parse(window.atob(base64Url));
					userDetails = decodedToken;
				});
		} catch (error) {}
	});

	async function post() {
		let post_id;
		const body = {
			message: postArea.value
		};
		console.log(body);

		try {
			await fetch(`http://localhost:3000/api/v1/post/post`, {
				method: 'POST',
				redirect: 'follow',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
				.then((response) => response.json())
				.then((data) => {
					//alert('Posted');
					// window.open('/posts');
					message = data.msg;
					post_id = data.postId;
				});

			if (files[0]) {
				console.log(files[0]);

				const formData = new FormData();
				formData.append('media', files[0]);

				await fetch(`http://localhost:3000/api/v1/addMedia?id=${post_id}`, {
					method: 'POST',
					redirect: 'follow',
					credentials: 'include',
					body: formData
				})
					.then((response) => response.json())
					.then((data) => {
						//alert('Posted');
						// window.open('/posts');
					});
			} else {
				console.log('no');
			}
		} catch (error) {
			console.error(error);
		}

		successMsg = true;
		setTimeout(() => {
			successMsg = !successMsg;
			window.open('/posts', '_self');
		}, 3000);
	}

	function selectFile() {
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*, video/*';
		input.onchange = () => {
			const file = input.files[0];
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				//console.log(reader.result);
				display.style.backgroundImage = `url(${reader.result})`;
				pic.src = reader.result;

				files.push(file);
			});
			if (file) {
				console.log(files);
				reader.readAsDataURL(file);
			}
		};
		input.click();
	}
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>

<main class="main w-full p-1 flex flex-col justify-center items-center">
	<label for="post_area" class="text-amber-400 font" id="text_label">Write your post</label>
	<textarea
		name="post_area"
		id="post_area"
		class="w-10/12 bg-zinc-900 text-amber-400 ml-2 mb-2"
		cols="100"
		rows="10"
	/>

	<div class="utilities mt-2 flex row justify-around mb-2 ">
		<div id="photos" class="mr-2">
			<div id="photo_desc">Photos</div>
			<button
				class="w-10 h-10 bg-zinc-900 text-amber-400 border-2 rounded-xl border-amber-400 hover:bg-amber-400 hover:text-zinc-900 "
				on:click={selectFile}
			>
				<i class="fa fa-picture-o" aria-hidden="true" />
			</button>
		</div>

		<div id="camera" class="ml-2">
			<div id="photo_desc">camera</div>
			<button
				class="w-10 h-10 bg-zinc-900 text-amber-400 border-2 rounded-xl border-amber-400 hover:bg-amber-400 hover:text-zinc-900 "
			>
				<i class="fa fa-camera-retro" aria-hidden="true" />
			</button>
		</div>
	</div>

	<button
		class="bg-zinc-900 text-amber-400 border-2 mb-3 rounded-xl border-amber-400 hover:bg-amber-400 hover:text-zinc-900 w-20 h-12 mt-2 ml-2"
		on:click={post}
	>
		Post
	</button>
	<div id="display" class="">
		<img src="" class="w-fit h-fit" alt="my post" id="content_pic" />
		<!-- <video src="" width="640" height="240" controls id="content_video" /> -->
	</div>

	{#if successMsg === true}
		<SuccessMsg msg={message} />
	{/if}
</main>

<style>
	#text_label {
		font-family: 'Times New Roman', Times, serif;
	}
</style>
