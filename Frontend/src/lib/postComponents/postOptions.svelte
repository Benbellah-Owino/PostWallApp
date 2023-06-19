<script>
	import { message } from '../../stores/msgStore';
	export let user;
	console.log(user);

	async function followUser() {
		let body = {
			id: user.postedBy
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
					$message = `You've followed ${user.userName}`;
				});
		} catch (error) {
			console.error(error);
		}
	}
</script>

<main
	id="postOptions"
	class="main absolute top-5 right-2 flex flex-col justify-start items-center w-52 h-60 z-50 m-4 bg-zinc-800 border border-amber-400 rounded shadow-md shadow-amber-400 "
>
	<div
		on:click|stopPropagation={followUser}
		class="optionLink hover:bg-amber-100 hover:bg-opacity-10"
	>
		<h1 class="link">Follow {user.userName}</h1>
	</div>

	<div class="optionLink hover:bg-red-300 hover:bg-opacity-25">
		<h1 class="link text-red-500">Option2</h1>
	</div>

	<div class="optionLink hover:bg-amber-100 hover:bg-opacity-10">
		<h1 class="link">Option3</h1>
	</div>
</main>

<style>
	.optionLink {
		width: 100%;
		padding-left: 4px;

		height: 30px;
		cursor: pointer;
	}
</style>
