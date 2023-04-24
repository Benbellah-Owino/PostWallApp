<script>
	import { allUsers } from '../../stores/users';
	export let user;
	async function follow() {
		let body = {
			id: user._id
		};

		try {
			await fetch(`http://localhost:3000/api/v1/auth/followUser`, {
				method: 'POST',
				credentials: 'include',
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
				.then((response) => response.json())
				.then((data) => {
					allUsers.update((users) => {
						return (users = users.filter((use) => use._id !== user._id));
					});
					alert(data.msg);
				});
		} catch (error) {
			console.error(error.msg);
		}
	}
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<div class="user_tile bg-zinc-900 w-11/12 h-16 flex flex-row justify-around items-center relative">
	<div
		class="profile_pic h-12 w-12 border-2 flex justify-center items-center border-amber-400 text-amber-400 absolute left-2 mb-0 rounded-full"
	>
		<i class="fa-regular fa-user text-sm" />
	</div>
	<h3 class="username text-amber-400 text-xl hover:text-zinc-900">{user.name}</h3>
	<button id="follow_user" class="bg-amber-400 text-zinc-900 rounded-lg w-14" on:click={follow}
		><b>follow</b></button
	>
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
