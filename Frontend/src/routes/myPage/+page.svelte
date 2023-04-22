<script>
	import NavBar from '$lib/myNavbar.svelte';
	import MainNav from '$lib/vertNavbar.svelte';
	import MyPosts from '../../myComponents/myPosts.svelte';
	import MyFollowers from '../../myComponents/myFollowers.svelte';
	import ImFollowed from '../../myComponents/imFollowing.svelte';
	import { myMenu } from '../../stores/myMenuStore';
	import CreatePostButton from '$lib/createPostButton.svelte';

	// customElements.define('MainNav', MainNav);
	let menuActive = false;

	function toggleMenu() {
		menuActive = !menuActive;
	}

	function dock() {
		menuActive = !menuActive;
	}
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
