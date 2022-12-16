<script>
    import Post from "$lib/post.svelte"
    import NavBar from "$lib/navBar.svelte"
    import CreatePostButton from "$lib/createPostButton.svelte"
</script>

<div class="post_wall bg-amber-900 w-screen ">
    <NavBar/>
    <CreatePostButton/>
    <div class="p-0 w-full flex-col justify-start">
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
    </div>

</div>

<style>
    
</style>