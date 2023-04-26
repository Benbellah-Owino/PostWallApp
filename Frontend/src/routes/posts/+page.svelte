<script>
	import Post from '$lib/post.svelte';
	import NavBar from '$lib/navBar.svelte';
	import CreatePostButton from '$lib/postComponents/createPostButton.svelte';
	import PostOptions from '$lib/postComponents/postOptions.svelte';
	import { onMount } from 'svelte';
	import { posts } from '../../stores/posts.js';
	import { postOptionsObj } from '../../stores/myMenuStore.js';

	onMount(async () => {
		await fetch('http://localhost:3000/api/v1/post/getposts', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				posts.set(data.finalPosts);
			});
	});
</script>

<div class="post_wall bg-amber-900 w-screen ">
	<NavBar />
	<CreatePostButton />

	<div class="p-0 w-full flex-col justify-start">
		{#each $posts as post (post._id)}
			<Post {post} />
		{/each}
	</div>
</div>

<style>
</style>
