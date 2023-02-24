<script>
	import User from '$lib/user.svelte';
	import NavBar from '$lib/navBar.svelte';
	import CreatePostButton from '$lib/createPostButton.svelte';
	import { allUsers } from '../../stores/users';
	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('Fire');
		await fetch('http://localhost:3000/api/v1/auth/getusers', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				allUsers.set(data.users);
				console.log($allUsers);
			});
	});
</script>

<main class="w-screen h-screen p-0">
	<NavBar />
	<CreatePostButton />
	<div
		class="post_wall bg-amber-900 w-full flex flex-col items-center top-20 m-0 p-0"
		id="users_container"
	>
		{#each $allUsers as user (user._id)}
			<User {user} />
		{/each}
	</div>
</main>

<style>
	#users_container {
		overflow: scroll;
	}

	#users_container::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	#users_container {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
