<script>

import {createEventDispatcher} from "svelte";
import {slide} from "svelte/transition"

const dispatch=createEventDispatcher();
function dockNav(){
    dispatch("dock",{
        detail:false
    })
}


</script>

<svelte:head><script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script></svelte:head>

<div transition:slide|local class="bg-zinc-900  h-4/5 flex flex-col items-center justify-around p-0 rounded-sm mb-1 fixed top-20 left-0" id="this " on:touchmove={dockNav}>
    <div class="navBtns  text-amber-400 text-base font-bold h-9 w-16 rounded flex justify-center items-center" ><a href="/posts">POSTS</a> </div>
    <div class="navBtns text-amber-400 text-base font-bold h-9 w-16 rounded  flex justify-center items-center" ><a href="/users">USERS</a></div>
    <div class="navBtns search text-amber-400 text-base font-bold h-9 w-12 rounded text-center"><i class="fa-solid fa-magnifying-glass text-yellow-300 text-sm"></i></div>
<button class="navBtns border-2 border-amber-400 text-amber-400 text-base font-bold h-11 w-12 rounded " on:click={dockNav}><i class="fa-solid fa-bars text-yellow-300 text-base"></i></button>

</div>

<style>
    .navBtns:hover{
        background-color:rgba(251,191,36,0.3);
        transition: all ease 0.3s;
    }

    .navBtns i:hover{
        color:rgb(24,24,27);
        transition: all ease 0.3s;;
    }
</style>