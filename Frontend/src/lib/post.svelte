<script>
	import { onMount } from 'svelte';
	export let post;
	let postObj = post;
	let user = { name: '' };
	$: name = user.name;

	let frame;

	let image;

	let isImage = false;

	let isLiked;

	let lc = postObj.noLikes;

	$: likeCount = lc;
	onMount(() => {
		frame = document.getElementById('frame');

		fetch(`http://localhost:3000/api/v1/auth/getpostuser?id=${postObj.postedBy}`, {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				try {
					if (data.status == 'pass') {
						user = data.msg;
					} else {
						console.log(data.msg);
					}
				} catch (error) {
					console.log(error);
				}
			});

		fetch(`http://localhost:3000/api/v1/post/getmedia?post_id=${postObj._id}`, {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json,image/jpeg,image/png'
			}
		})
			.then((response) => response.blob())
			.then((data) => {
				if (data.type == 'application/json') {
					image = 'none';
				} else {
					image = URL.createObjectURL(data);

					isImage = true;
					// const img = document.createElement('img');
					//frame.src = url;

					// frame.style.background = url;
				}
			});

		fetch(`http://localhost:3000/api/v1/post/checklike?post_id=${postObj._id}`, {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.liked == 'true') {
					isLiked = true;
				} else if (data.liked == 'false') {
					isLiked = false;
				}
				console.log(`{\n post: ${postObj.message}\n isLiked: ${isLiked}}`);
			});
	});

	async function likePost() {
		// let bdy = {
		// 	postId: postObj._id
		// };
		//console.log(bdy);
		await fetch(`http://localhost:3000/api/v1/post/like?postId=${postObj._id}`, {
			method: 'POST',
			redirect: 'follow',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
			// body: JSON.stringify(bdy)
		})
			.then((response) => response.json())
			.then((data) => {
				if (isLiked === true) {
					lc--;
				} else if (isLiked === false) {
					lc++;
				}
				isLiked = !isLiked;
			})
			.catch((error) => {
				console.log(error);
			});
	}
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<div class="post bg-zinc-900 h-fit w-screen relative border-b-2 pt-2">
	<div class="profile_pic border-2 w-8 h-8 border-amber-400 rounded-full mb-1" />
	<h3 class="username text-amber-400 absolute">{name}</h3>
	<div class="payload h-fit max-h-40 text-amber-400 text-sm">
		{postObj.message}
	</div>

	{#if isImage === true}
		<img
			id="frame"
			class="frame ml-auto mr-auto mb-1 mt-1 lg:w-4/12 lg:h-72  sm:w-5/12 sm:h-64 w-9/12 h-52 border-2 border-amber-400"
			alt={postObj.message}
			src={image}
		/>
	{/if}

	<div class="post_buttons h-16 w-full flex flex-row justify-start items-center">
		{#if isLiked == false}
			<div class="like_cont h-full w-fit flex flex-row justify-start items-center">
				<button
					id="likePost"
					class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-1"
					on:click={likePost}><i class="fa-regular fa-thumbs-up w-6 h-6 btnIcon" /></button
				>
				<h3 class="like_count text-amber-400">{likeCount}</h3>
			</div>
		{:else if isLiked == true}
			<div class="like_cont h-full w-fit flex flex-row justify-start items-center">
				<button
					id="likePost"
					class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-1"
					on:click={likePost}><i class="fa-sharp fa-solid fa-thumbs-down" /></button
				>
				<h3 class="like_count text-amber-400">{likeCount}</h3>
			</div>
		{/if}
		<button id="replyToPost" class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4">
			<i class="fa-regular fa-comment w-6 h-6 btnIcon" /></button
		>
	</div>
</div>

<style>
	.post {
		width: 98%;
		border-color: rgb(180, 83, 9, 0.3);
	}

	.username {
		top: 10px;
		left: 45px;
	}
	.payload {
		overflow: scroll;
	}

	.payload::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.payload {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.postBtn:hover {
		background-color: rgb(251, 191, 36);
		color: rgb(27, 27, 24);
		transition: all ease 0.3s;
	}
</style>
