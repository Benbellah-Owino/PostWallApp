<script>
	import User from '$lib/user.svelte';
	import { onMount } from 'svelte';
	import { imFollowing } from '../stores/users';

	onMount(async () => {
		console.log('fire');
		await fetch('http://localhost:3000/api/v1/auth/getFollowing', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				imFollowing.set(data.final);
				console.log($imFollowing);
			});
	});
</script>

<div
	class="users_container post_wall absolute bg-amber-900 flex flex-col items-center m-0 p-0 w-10/12 top-20 left-16"
>
	<h1 class="-top-24 left-10">Hello</h1>
	{#each $imFollowing as user (user._id)}
		<User {user} />
	{/each}
</div>

<style>
	.users_container {
		overflow: scroll;
	}

	.users_container::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.users_container {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
