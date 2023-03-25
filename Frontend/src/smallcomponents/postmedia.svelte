<script>
import { onMount } from "svelte";
export let media;

let frame
onMount(()=>{
    frame = document.getElementById("frame");
    frame.style.background
})

</script>

<main id="frame" class="main w-7/12 h-52 border-2 border-amber-400">

</main>

<style>

</style>