// Sidebar Toggle

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

if(menuBtn){

    menuBtn.onclick=function(){

        sidebar.classList.toggle("show");

    }

}

// Active Menu

const links=document.querySelectorAll(".sidebar-menu a");

links.forEach(link=>{

    if(link.href===window.location.href){

        link.classList.add("active");

    }

});

// Close Sidebar on Mobile

document.addEventListener("click",function(e){

    if(window.innerWidth<1200){

        if(!sidebar.contains(e.target) && !menuBtn.contains(e.target)){

            sidebar.classList.remove("show");

        }

    }

});