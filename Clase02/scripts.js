function saludar(){
    alert('Hola salamin');
}

// MANEJADOR DE EVENTOS
/*function handlerClick(){
    alert("Hola mundo");
}
*/

let boton;
// devuelve direccion en memoria donde esta el boton

//cuando se lanze el evento load, osea cuando la pagina ya este cargada la pagina
window.addEventListener("load",function(){
    
    boton = document.getElementById("btnSaludo");

    boton.addEventListener("click",function(){
        alert("Hola mundo");
    });
})