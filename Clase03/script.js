// Maneras de obtener referencia de elementos del html
//console.log(document.getElementById("tabla-materias"));
//console.log(document.getElementsByClassName("verde")[0]);
//console.log(document.getElementsByTagName("table")[0]);

document.getElementById("btnOpen").addEventListener("click",()=>{
    document.getElementsByTagName("dialog")[0].open = true;
})
document.getElementById("btnClose").addEventListener("click",()=>{
    document.getElementsByTagName("dialog")[0].removeAttribute("open");
})