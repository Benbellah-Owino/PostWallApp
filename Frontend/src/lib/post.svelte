<script>


</script>

<svelte:head><script src="https://kit.fontawesome.com/42b8efcb5a.js" crossorigin="anonymous"></script></svelte:head>
<div class="post bg-zinc-900 h-fit w-screen relative border-b-2 pt-2">
    <div class="profile_pic border-2 w-8 h-8 border-amber-400 rounded-full mb-1"></div><h3 class="username text-amber-400 absolute">Username</h3>
    <div class="payload h-fit max-h-40 text-amber-400 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis similique accusantium totam necessitatibus accusamus ex quisquam porro, velit nihil veritatis quaerat soluta? Minus quidem quos sint ipsa consequuntur, error harum recusandae est quaerat a aut, odio labore doloremque esse commodi cumque soluta. Numquam, optio corporis aut aliquam repellat reiciendis harum quasi odio ipsum nesciunt officiis minima at nihil? Nostrum est facilis, illo numquam fuga labore corporis cupiditate commodi voluptatibus a, architecto repellat, ut similique excepturi facere neque tempora. Quidem nihil officiis quam tenetur corrupti eveniet commodi ut magnam voluptatem iure consequuntur repellendus odio, quia iusto officia nesciunt sapiente, ullam quasi excepturi tempora porro eum ab! Accusantium laboriosam aliquid iure eius consequatur. Quibusdam rem, perferendis vero eos modi expedita nemo porro harum nam beatae adipisci placeat, ducimus ipsa velit pariatur. Necessitatibus a dolor quos officiis rerum voluptas magnam asperiores minima explicabo eos. Error numquam reiciendis quisquam adipisci deserunt quasi, optio doloribus quam tenetur! Sunt modi numquam, fugiat enim cupiditate, porro sed voluptates aperiam obcaecati totam quos id necessitatibus laboriosam fugit debitis iste architecto eum doloremque repudiandae nulla, iusto inventore tenetur. Commodi quas excepturi iste, repellendus itaque ipsa ipsam hic culpa impedit tenetur eius beatae ut expedita. Animi blanditiis veniam neque? Sapiente eaque in beatae. Rerum laborum modi veritatis, soluta molestias id ipsa voluptates minima rem eaque perspiciatis et dignissimos saepe fuga voluptatem nulla repudiandae mollitia porro blanditiis repellendus, molestiae facilis ducimus expedita nam! Alias numquam minima quas! Molestias, magni sequi. Voluptatem quod facere odio incidunt debitis dolorem voluptas delectus cupiditate dolore aliquid excepturi fugiat, alias aspernatur, eaque architecto, unde sed et repellendus labore consectetur aperiam voluptate ex maxime? Rem veniam quo excepturi, architecto autem numquam dicta ullam mollitia maxime alias voluptas praesentium provident at qui. Sequi doloribus dolor reiciendis voluptatibus similique facilis deleniti molestias vel at est? Illum at fugit aperiam ad, ut cumque ratione inventore provident possimus voluptates similique quasi fugiat sunt, cum ab dicta consectetur, nam amet eum! Ipsum eveniet, a, omnis neque optio illum voluptas odio, esse exercitationem cupiditate culpa sit asperiores ipsa. Voluptatem saepe nihil in odio corporis aliquam obcaecati provident deleniti labore incidunt ullam, possimus, nesciunt modi culpa tempora, velit laudantium vel? Quos obcaecati illo voluptatibus. Incidunt culpa error temporibus vero officia, molestiae odit voluptatem ratione quia exercitationem, explicabo inventore necessitatibus mollitia commodi laborum, id nesciunt vitae nemo quae? Sunt aspernatur odit at fugit velit error sit, id quo quibusdam possimus quis vero ratione itaque esse?</div>
    <div class="post_buttons h-16 w-full flex flex-row justify-start items-center">
    
        <button class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4 mr-6"><i class="fa-regular fa-thumbs-up w-6 h-6 btnIcon"></i></button>
        <button class="postBtn text-amber-400 w-9 h-9 rounded-md ml-4"> <i class="fa-regular fa-comment w-6 h-6 btnIcon"></i></button>
    </div>
</div>

<style>
    .post{
        width:98%;
        border-color: rgb(180,83,9,0.3);
    }

    .username{
        top:10px;
        left:45px;
    }
    .payload{
        overflow: scroll;
    }

    .payload::-webkit-scrollbar {
    display: none;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .payload {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    }


    .postBtn:hover{
        background-color:rgb(251,191,36);
        color:rgb(27,27,24);
        transition: all ease 0.3s;
    }
</style>