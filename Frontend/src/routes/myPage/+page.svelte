<script>
	import NavBar from '$lib/myNavbar.svelte';
	import MainNav from '$lib/vertNavbar.svelte';
	import MyPosts from '$lib/myComponents/myPosts.svelte';
	import MyFollowers from '$lib/myComponents/myFollowers.svelte';
	import ImFollowed from '$lib/myComponents/imFollowing.svelte';
	import { myMenu } from '../../stores/myMenuStore';
	import CreatePostButton from '$lib/postComponents/createPostButton.svelte';
	import { message } from '../../stores/msgStore';
	import SuccessMsg from '$lib/smallcomponents/successMsg.svelte';
	import { onDestroy } from 'svelte';

	// customElements.define('MainNav', MainNav);
	let menuActive = false;

	let alert = false;

	function toggleMenu() {
		menuActive = !menuActive;
	}

	function dock() {
		menuActive = !menuActive;
	}

	const unSubscribe = message.subscribe(() => {
		alert = true;
		setTimeout(() => (alert = !alert), 3000);
	});

	onDestroy(unSubscribe);
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<main class="flex flex-col items-center justify-start relative w-full h-screen">
	<NavBar class="z-10" />
	<CreatePostButton />
	{#if menuActive == true}
		<MainNav
			class="flex flex-col items-center justify-center w-10 float-left z-10"
			on:dock={dock}
		/>
	{:else if menuActive == false}
		<button
			class="main_nav_btn w-12 h-12 border-2 border-amber-400 rounded-full bg-amber-400 text-zinc-900 z-10 fixed"
			on:click={toggleMenu}><i class="fa-solid fa-bars text-zinc-900 text-sm " /></button
		>
	{/if}

	{#if $myMenu === 1}
		<MyPosts class="posts w-full" />
	{:else if $myMenu === 2}
		<MyFollowers class=" w-10/12 left-11 top-20" />
	{:else if $myMenu === 3}
		<ImFollowed class=" w-10/12 left-11 top-20" />
	{/if}

	{#if alert === true}
		<SuccessMsg msg={$message} />
	{/if}
</main>

<style>
	.main_nav_btn {
		top: 86%;
		left: 90%;
	}

	.main_nav_btn:hover {
		background-color: rgb(251, 151, 36);
		color: rgb(24, 24, 27);
		transition: all ease 0.3s;
	}
</style>
