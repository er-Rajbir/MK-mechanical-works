console.log("MK Industries Website Loaded");
window.addEventListener("scroll",function(){

const navbar=document.querySelector(".navbar");

if(window.scrollY>50){

navbar.style.background="#000";

navbar.style.boxShadow="0 5px 20px rgba(0,0,0,.4)";

}
else{

navbar.style.background="rgba(10,10,10,.90)";

navbar.style.boxShadow="none";

}

});