<script>
	import { onMount } from 'svelte';
	export let post;
	let user = { name: '' };
	$: name = user.name;

	function onLoad() {
		fetch(`http://localhost:3000/api/v1/auth/getpostuser?id=${post.postedBy}`, {
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
	}

	onLoad();
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
		{post.message}
	</div>
	<div class="post_buttons h-16 w-full flex flex-row justify-start items-center">
		<button class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-6"
			><i class="fa-regular fa-thumbs-up w-6 h-6 btnIcon" /></button
		>
		<button class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4">
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
