<script>
	import { onMount } from "svelte";
    import {myMenu} from "../stores/myMenuStore"

    let postButton
    let followersButton
    let followingButton

onMount(()=>{
    postButton=document.getElementById("postB")
    followersButton=document.getElementById("followersB")
    followingButton=document.getElementById("followingB")
})

function postBtn(){
    myMenu.update(n=>n=1)
    postButton.style.backgroundColor='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
    postButton.style.color='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followingButton.style.backgroundColor=followersButton.style.backgroundColor='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followingButton.style.color=followersButton.style.color='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
}

function followersBtn(){
    myMenu.update(n=>n=2)
    followersButton.style.backgroundColor='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
    followersButton.style.color='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followingButton.style.backgroundColor=postButton.style.backgroundColor='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followingButton.style.color=postButton.style.color='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
}

function followingBtn(){
    myMenu.update(n=>n=3)
    followingButton.style.backgroundColor='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
    followingButton.style.color='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followersButton.style.backgroundColor=postButton.style.backgroundColor='rgb(' + 24 +' , '+ 24 + ' , ' + 27 +')'
    followersButton.style.color=postButton.style.color='rgb(' + 251 +' , '+ 191 + ' , ' + 36 +')'
}

</script>
<svelte:head><script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script></svelte:head>
<div class="fixed bg-zinc-900 w-full h-20 flex items-center justify-around p-0 rounded-sm mb-1 z-20">
<button class="navBtns text-amber-400 text-base font-bold h-11 w-18 rounded" on:click={postBtn} id="postB">myPOSTS</button>
<button class="navBtns  text-amber-400 text-base font-bold h-11 w-24 rounded" on:click={followersBtn} id="followersB">FOLLOWERS</button>
<button class="navBtns text-amber-400 text-base font-bold h-11 w-24 rounded" on:click={followingBtn} id="followingB">FOLLOWING</button>

<button class="navBtns  text-amber-400 text-base font-bold h-11 w-8 rounded-xl" ><i class="fa-solid fa-magnifying-glass text-yellow-300 text-sm"></i></button>

</div>

<style>
    .navBtns:hover{
        background-color:rgb(251,191,36);
        color:rgb(24,24,27);
        box-shadow: 2px -15px 65px 5px rgba(251,191,36,0.53);
-webkit-box-shadow: 2px -15px 65px 5px rgba(251,191,36,0.53);
-moz-box-shadow: 2px -15px 65px 5px rgba(251,191,36,0.53);
        transition: all ease 0.3s;
        transition: all ease 0.3s;
    }
</style>