<script>
	import Post from '$lib/post.svelte';
	import NavBar from '$lib/navBar.svelte';
	import CreatePostButton from '$lib/createPostButton.svelte';
	import { onMount } from 'svelte';
	import { posts } from '../../stores/posts.js';

	onMount(async () => {
		console.log('Fire');
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
				console.log($posts);
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
