<script>
    import User from "$lib/user.svelte"
    import NavBar from "$lib/navBar.svelte";
    import CreatePostButton from "$lib/createPostButton.svelte"
</script>
<main class="w-screen h-screen p-0">
    <NavBar/>
    <CreatePostButton/>
<div class="post_wall bg-amber-900 w-full flex flex-col items-center top-20 m-0 p-0" id="users_container">
    <User/>
    <User/>
    <User/>
    <User/>
</div>

</main>
<style>
    #users_container{
    overflow: scroll;
    }

    #users_container::-webkit-scrollbar {
    display: none;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    #users_container {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    }
</style>