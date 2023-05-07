<script>
	import User from '$lib/userComponents/user.svelte';
	import NavBar from '$lib/navBar.svelte';
	import CreatePostButton from '$lib/postComponents/createPostButton.svelte';
	import { allUsers } from '../../stores/users';
	import { onMount, onDestroy } from 'svelte';

	import { message } from '../../stores/msgStore';
	import SuccessAlert from '$lib/smallComponents/successMsg.svelte';

	let alert = false;

	onMount(async () => {
		await fetch('http://localhost:3000/api/v1/auth/getusers', {
			credentials: 'include',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				allUsers.set(data.final);
			});
	});

	const unSubscribe = message.subscribe(() => {
		alert = true;
		setTimeout(() => (alert = !alert), 3000);
	});

	onDestroy(unSubscribe);
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

	{#if alert === true}
		<SuccessAlert msg={$message} />
	{/if}
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
