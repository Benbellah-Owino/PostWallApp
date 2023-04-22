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

	let replyTo;
	let replyUser;

	$: likeCount = lc;
	onMount(async () => {
		frame = document.getElementById('frame');

		await fetch(`http://localhost:3000/api/v1/auth/getpostuser?id=${postObj.postedBy}`, {
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

		await fetch(`http://localhost:3000/api/v1/post/getmedia?post_id=${postObj._id}`, {
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
				}
			});

		await fetch(`http://localhost:3000/api/v1/post/checklike?post_id=${postObj._id}`, {
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
			});

		if (postObj.isReply) {
			await fetch(`http://localhost:3000/api/v1/post/getop?post_id=${postObj.replyTo}`, {
				credentials: 'include',
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((response) => response.json())
				.then((data) => {
					replyTo = data.postedBy.postedBy;
				});

			await fetch(`http://localhost:3000/api/v1/auth/getpostuser?id=${replyTo}`, {
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
							replyUser = data.msg.name;
						} else {
							console.log(data.msg);
						}
					} catch (error) {
						console.log(error);
					}
				});
		}
	});

	async function likePost() {
		await fetch(`http://localhost:3000/api/v1/post/like?postId=${postObj._id}`, {
			method: 'POST',
			redirect: 'follow',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
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

	//When the post is clicked
	function openPost() {
		window.open(`/postPage?post_id=${postObj._id}`);
	}
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<div
	class="post flex flex-col  h-fit w-screen relative  bg-zinc-900 border-b-2 pt-2 hover:cursor-pointer hover:bg-zinc-600 "
	on:click={openPost}
>
	{#if postObj.isReply == true}
		<h3 class=" mb-1 font-size">Reply to @{replyUser}</h3>
	{/if}
	<div class="user_details flex flex-row justify-start items-center float-left h-fit mb-4 p-1  ">
		<div class="profile_pic border-2 w-8 h-8 border-amber-400 rounded-full mr-4" />
		<h3 class="username text-amber-400">{name}</h3>
	</div>

	<div class="payload h-fit max-h-40 text-amber-400 text-sm ml-2 ">
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
			<div class="like_cont h-full w-fit mr-2 flex flex-row justify-start items-center">
				<button
					id="likePost"
					class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-1"
					on:click|stopPropagation={likePost}
					><i class="fa-regular fa-thumbs-up w-6 h-6 btnIcon" /></button
				>
				<h3 class="like_count text-amber-400">{likeCount}</h3>
			</div>
		{:else if isLiked == true}
			<div class="like_cont h-full w-fit mr-2 flex flex-row justify-start items-center">
				<button
					id="likePost"
					class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-1"
					on:click|stopPropagation={likePost}><i class="fa-sharp fa-solid fa-thumbs-down" /></button
				>
				<h3 class="like_count text-amber-400">{likeCount}</h3>
			</div>
		{/if}
		<div class="like_cont h-full w-fit ml-4 flex flex-row justify-start items-center">
			<button id="replyToPost" class="postBtn w-9 h-9 rounded-md text-amber-400 text-center ">
				<i class="fa-regular fa-comment w-6 h-6 btnIcon" /></button
			>
			<h3 class="reply_count text-amber-400">{postObj.noReplies}</h3>
		</div>
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
