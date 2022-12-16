<script>
    import User from "$lib/user.svelte"

</script>
<div class="users_container post_wall absolute bg-amber-900 flex flex-col items-center m-0 p-0 w-10/12 top-20 left-16" >
    <User/>
    <User/>
    <User/>
    <User/>
</div>

<style>
    .users_container{
    overflow: scroll;
    }

    .users_container::-webkit-scrollbar {
    display: none;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .users_container {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    }
</style>