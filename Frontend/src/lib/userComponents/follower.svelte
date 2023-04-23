<script>
	export let user;
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<div
	id={user.userId}
	class="user_tile bg-zinc-900 w-11/12 h-16 flex flex-row justify-around items-center relative"
>
	<div
		class="profile_pic h-12 w-12 border-2 flex justify-center items-center border-amber-400 text-amber-400 absolute left-2 mb-0 rounded-full"
	>
		<i class="fa-regular fa-user text-sm" />
	</div>
	<h3 class="username text-amber-400 text-xl hover:text-zinc-900">{user.userName}</h3>
</div>

<style>
	.user_tile:hover {
		background-color: rgb(207, 143, 69);
		color: rgb(24, 24, 27);
		transition: all 0.3s ease;
	}

	.username,
	.user_tile {
		cursor: pointer;
	}

	#follow_user {
		position: absolute;
		right: 20px;
	}

	.username {
		position: absolute;
		left: 100px;
	}
</style>
