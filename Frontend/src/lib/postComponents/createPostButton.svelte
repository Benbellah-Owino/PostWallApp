<script>

function open(){
    window.open("/createPost","_blank")
}
</script>

<svelte:head><script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script></svelte:head>
<main class="btn flex justify-center items-center w-14 h-14 z-50 fixed  left-1 rounded-full text-zinc-900 bg-amber-400 border-2 border-amber-400 hover:bg-amber-700 hover:text-zinc-900" on:click={open}>
    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
</main>

<style>
.btn{
    top:90%
}
</style>