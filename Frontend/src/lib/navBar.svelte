<script>
	import { onMount } from 'svelte';
	// let active;
	// function activate(id){
	//     active.classList.remove("active")
	//     active=""
	//     active=document.getElementById(id);
	//     active.classList.add("active");
	//}

	onMount(async () => {
		try {
			fetch('http://localhost:3000/api/v1/auth/userDetails', {
				credentials: 'include'
			})
				.then((response) => response.json())
				.then((data) => {
					let base64Url = data.details.split('.')[1];
					let decodedToken = JSON.parse(window.atob(base64Url));
					document.getElementById('username').textContent = decodedToken.userName;
				});
		} catch (error) {}
	});

	async function logout() {
		try {
			fetch('http://localhost:3000/api/v1/auth/logout', { method: 'POST', credentials: 'include' })
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
				});
			window.close();
			window.open('/login');
		} catch (error) {}
	}
</script>

<svelte:head
	><script
		src="https://kit.fontawesome.com/42b8efcb5a.js"
		crossorigin="anonymous"></script></svelte:head
>
<div class="bg-zinc-900 w-full h-16 flex items-center justify-around p-0 m-0 rounded-sm mb-1">
	<div class="details"><h5 id="username">User</h5></div>
	<div
		class="navBtns  text-amber-400 text-base font-bold h-9 w-16 rounded flex justify-center items-center cursor-pointer"
	>
		<a id="posts" href="/posts" aria-current="page">POSTS</a>
	</div>
	<div
		class="navBtns text-amber-400 text-base font-bold h-9 w-16 rounded  flex justify-center items-center cursor-pointer"
	>
		<a id="users" href="/users">USERS</a>
	</div>
	<div
		class="navBtns  text-amber-400 text-base font-bold h-9 w-20 rounded  flex justify-center items-center cursor-pointer"
	>
		<a id="myPage" href="/myPage">MYPAGE</a>
	</div>

	<div
		class="navBtns text-amber-400 text-base font-bold h-9 w-12 rounded flex justify-center items-center cursor-pointer"
	>
		<i class="fa-solid fa-magnifying-glass text-yellow-300 text-sm" />
	</div>
	<button
		id="logout"
		class="p-1 w-16 h-13 bg-black text-amber-400 border-2 border-amber-400 rounded-md hover:bg-amber-400 hover:text-zinc-900 hover:font-semibold"
		on:click={logout}><i class="fa-solid fa-right-from-bracket" /></button
	>
</div>

<style>
	.navBtns:hover,
	i:hover {
		background-color: rgba(251, 191, 36, 0.8);
		color: rgb(24, 24, 27);
		box-shadow: 2px -15px 65px 5px rgba(251, 191, 36, 0.53);
		-webkit-box-shadow: 2px -15px 65px 5px rgba(251, 191, 36, 0.53);
		-moz-box-shadow: 2px -15px 65px 5px rgba(251, 191, 36, 0.53);
		transition: all ease 0.3s;
	}
	/* .active{
        background-color:rgba(251,191,36,0.8);
        color:rgb(24,24,27);
    } */
</style>
