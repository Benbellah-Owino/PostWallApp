<script>
	import Post from '$lib/post.svelte';
	import { onMount } from 'svelte';
	import { myPosts } from '../stores/posts';

	onMount(async () => {
		console.log('Fire');
		await fetch('http://localhost:3000/api/v1/post/getmyposts', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				myPosts.set(data.posts);
				console.log($myPosts);
			});
	});
</script>

<div class="absolute post_wall bg-amber-900 p-0 flex-col justify-start top-20 left-16 w-screen">
	{#each $myPosts as post (post._id)}
		<Post {post} />
	{/each}
</div>

<style>
</style>
