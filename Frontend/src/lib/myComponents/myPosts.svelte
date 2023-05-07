<script>
	import MyPost from '$lib/myPost.svelte';
	import { onMount } from 'svelte';
	import { myPosts } from '../../stores/posts';

	onMount(async () => {
		await fetch('http://localhost:3000/api/v1/post/getmyposts', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				myPosts.set(data.posts);
			});
	});
</script>

<div class="absolute post_wall bg-amber-900 p-0 flex-col justify-start top-20 left-16 w-10/12">
	{#each $myPosts as post (post._id)}
		<MyPost {post} />
	{/each}
</div>

<style>
</style>
