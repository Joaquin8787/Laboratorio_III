

// Obtengo referencia al formulario
const formulario = document.forms[0];

// Le agrego un manejador de eventos al formulario. Se lo agrego al evento submit
//Si quiero tener informacion del evento que se acaba de disparar, ese manejador de evnetos siempre va a recibir un objeto event.  
formulario.addEventListener('submit',(e)=>{
    //Es la referencia al emisor del evento
    //e.target

    e.preventDefault();
    console.log("Hola");
})