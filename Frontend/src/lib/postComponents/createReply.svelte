<script>
	import { identity } from 'svelte/internal';
	import { onMount } from 'svelte';
	import { replies } from '../../stores/posts';
	export let payload;

	let files = [];

	let postArea;
	let pic;

	onMount(async () => {
		postArea = document.getElementById('txt_reply');

		pic = document.getElementById('content_pic');
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
				pic.src = reader.result;

				files.push(file);
			});
			if (file) {
				reader.readAsDataURL(file);
			}
		};
		input.click();
	}

	//Function for posting the reply
	async function reply() {
		let replyObj = {
			replyTo: payload.postId,
			message: postArea.value,
			isReply: true,
			tagged: []
		};

		console.log(replyObj);

		let post_id;

		try {
			await fetch(`http://localhost:3000/api/v1/post/comment`, {
				method: 'POST',
				redirect: 'follow',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(replyObj)
			})
				.then((response) => response.json())
				.then((data) => {
					//alert('Posted');
					// window.open('/posts');
					console.log(data.msg);
					post_id = data.newReply._id;

					console.log(post_id);
					replies.update((reps) => {
						return (reps = [...reps, data.newReply]);
					});
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
						console.log(data.msg);
						post_id = data.postId;
					});
			} else {
				console.log('no');
			}
		} catch (error) {
			console.error(error);
		}
	}

	console.log(payload);
</script>

<svelte:head>
	<script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script>
</svelte:head>

<main class="border-b-2 border-amber-400 p-1 w-11/12 ml-16">
	<h3 class="text-sm mb-1">Reply to @{payload.user}</h3>
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
			id="submit"
			on:click={reply}>reply</button
		>
	</div>
</main>

<style>
</style>
