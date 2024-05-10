import { lista } from "./data.js";
import {Villano} from "./entidades/villano.js"
import {Heroe} from "./entidades/heroe.js";
import {createForm,crearInputs} from "./form.js";
import { updateTable} from "./tabla.js";

//Importo los datos
const listaPersonas = JSON.parse(JSON.stringify(lista) || []);
const opciones = ["Todos", "Heroes", "Villanos"];
const tipos = ["Heroe", "Villano"];
let ordenActivo = true;

// Defino variables
const $seccionTabla = document.getElementById('seccion-table');
const $seccionFormulario = document.getElementById('formulario');
const $seccionHeaderTabla = document.getElementById('filter');

const colorHeader = "darkorange";
const identificador = "id";
const titulo = "Lista de Heroes y Villanos";

//Evaluo el tipo de cada registro y lo paso por el constructor correspondiente
const listaObjetos = procesarRegistros(listaPersonas);
let datosFiltrados = listaObjetos;
let btnAlta = document.getElementById("alta");

//Agrego el formulario como primer hijo
$seccionFormulario.insertBefore(createForm(listaObjetos,colorHeader,identificador,tipos), $seccionFormulario.firstChild);
const $formulario = document.querySelector('form');

//filtrar por (todos/heroes/villanos)
opciones.forEach(element =>{
    const option = document.createElement('option');
    option.textContent = element;
    $seccionHeaderTabla.appendChild(option);
});

updateTable($seccionTabla, listaObjetos, colorHeader, identificador, titulo);
crearInputs();

//EVENTOS

window.addEventListener('click', (e) => {
    if (e.target.matches('td')) {
        handlerSelectedTD(e);
        cambiarVisibilidad();
    }
    else if (e.target.matches('th')) {
        handlerSelectedTH(e);
    }
    else if (e.target.matches("input[type='submit']")) {
        handlerSubmit();
        cambiarVisibilidad();
    }
    else if (e.target.id === 'btnCalcularEdadPromedio') {
        
        let edadPromedio = calcularEdadPromedio(datosFiltrados);
        let inputText = document.getElementById('edadPromedio');
        inputText.value = edadPromedio;
    }
    else if (e.target.matches("input[type='reset']")) {
        console.log("Cancelando");
        resetFormulario($formulario);
    }
    else if (e.target.matches("input[id='eliminar']")){
        handlerDelete($formulario.id.value);
    }
});

// Agregar controladores de eventos a los checkboxes
document.querySelectorAll('.showColumn input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if(!checkbox.checked){
            checkbox.checked = false;
        }
        else{
            checkbox.checked = true;
        }
        updateColumnStyle(checkbox.id,checkbox);
    });
});

$seccionHeaderTabla.addEventListener("change", function() {
    const tipoSeleccionado = this.value;

    if(tipoSeleccionado == 'Heroes'){
        filtrarYMostrarDatos(listaObjetos,Heroe);
    }else if(tipoSeleccionado == 'Villanos'){
        filtrarYMostrarDatos(listaObjetos,Villano);
    }
    else{
        datosFiltrados = listaObjetos;
        updateTable($seccionTabla, listaObjetos, colorHeader, identificador, titulo);
    }
    resetCheckbox();
});

select.addEventListener("change", crearInputs);
btnAlta.addEventListener("click", cambiarVisibilidad);

// FUNCIONES
function resetCheckbox(){
    let checkboxes = document.querySelectorAll('.showColumn input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function updateColumnStyle(columnClass,checkbox) {
    const columns = document.querySelectorAll(`.${columnClass}Th`);
    columns.forEach(column => {
        if (column) {
            column.style.display = checkbox.checked?  '':'none';
        }
    });
}

function handlerCreate(nuevoUsuario) {
    console.log("Creando");
    listaObjetos.push(nuevoUsuario);

    updateTable($seccionTabla, listaObjetos, colorHeader, identificador, titulo);
}

function handlerUpdate(usuarioAModificar,valoresNuevos) {
    console.log("Actualizando");
    if(esRegistroDeTipo(valoresNuevos,Heroe) && esRegistroDeTipo(usuarioAModificar,Heroe)){
        console.log("Heroe");
        Object.keys(valoresNuevos).forEach(key => {
            // Actualiza la propiedad correspondiente en usuarioAModificar con el valor nuevo
            usuarioAModificar[key] = valoresNuevos[key];
        });
    }
    else{
        console.log("Villano");
        Object.keys(valoresNuevos).forEach(key => {
            // Actualiza la propiedad correspondiente en usuarioAModificar con el valor nuevo
            usuarioAModificar[key] = valoresNuevos[key];
        });
    }
    let index = listaObjetos.findIndex((elemento) => elemento.id == usuarioAModificar.id);
    listaObjetos.splice(index, 1, usuarioAModificar);

    updateTable($seccionTabla, listaObjetos, colorHeader, identificador, titulo);
}

function handlerDelete(id) {
    console.log("Eliminado");
    let index = listaObjetos.findIndex((elemento) => elemento.id == id);
    if(confirm("¿Desea eliminar este SuperHeroe?")){
        listaObjetos.splice(index, 1);
        updateTable($seccionTabla, listaObjetos, colorHeader, identificador, titulo);
        cambiarVisibilidad();
    }

}

function handlerSubmit() {    
    const $inputs = $formulario.querySelectorAll('input[type="text"]');
    let  values = {};

    $inputs.forEach(function(input) {
        values[input.id] = input.value;
    });
    try {
        // Verifico que la persona sea nueva
        if (values.id == '') {

            if (listaObjetos.length > 0) {
                values.id = generarId();
            }
            if(esRegistroDeTipo(values,Heroe)){
                console.log("heroe");
                const nuevoHeroe = new Heroe(values.id, values.nombre, values.apellido, values.edad, values.alterego, values.ciudad, values.publicado);
                if (confirm("¿Desea cargar el Heroe?")) handlerCreate(nuevoHeroe);
            }
            else{
                console.log("villano");
                const nuevoVillano = new Villano(values.id, values.nombre, values.apellido, values.edad, values.enemigo, values.robos, values.asesinatos);
                if (confirm("¿Desea cargar el Villano?")) handlerCreate(nuevoVillano);
            }
        } else {
            const objetoOriginal = listaObjetos.find(obj => obj.id == values.id);
            if (confirm("¿Desea realizar la modificación?")) handlerUpdate(objetoOriginal,values);
        }
        resetFormulario($formulario);
    } catch (error) {
        alert(error.message);
    }
}
function generarId()
    {
        let id;
        do{
            id = Math.floor(Math.random() * 10000)+1;
        }while(listaObjetos.some(p=>p.id==id))

        return id;
    }

function handlerSelectedTD(e) {
    const idSeleccionado = e.target.parentElement.dataset.id;

    const usuarioSeleccionado = listaObjetos.find((elemento) => elemento.id == idSeleccionado);
    cargarFormulario($formulario, usuarioSeleccionado);
}

function handlerSelectedTH(e) {
    
    const selector = e.target.textContent;
    console.log(selector);

    ordenarListaPorCriterio(datosFiltrados, selector, selector == ordenActivo);
    
    if (selector == ordenActivo) {
        ordenActivo = null;
    } else {
        ordenActivo = selector;
    }
    updateTable($seccionTabla, datosFiltrados, colorHeader, identificador, titulo);
}

function ordenarListaPorCriterio(lista, criterio, orden) {
    let auxiliar;
    for (let i = 0; i < lista.length; i++) {
        for (let j = i + 1; j < lista.length; j++) {
            if ((!orden && lista[i][criterio] > lista[j][criterio]) || (orden && lista[i][criterio] < lista[j][criterio])) {
                auxiliar = lista[i];
                lista[i] = lista[j];
                lista[j] = auxiliar;
            }
        }
    }
}

function calcularEdadPromedio(lista) {
    // Sumar todas las edades
    const sumaEdades = lista.reduce((total, elemento) => total + elemento.edad, 0);
    // Calcular el promedio
    const promedioEdad = sumaEdades / lista.length;
    return promedioEdad;
}

function esRegistroDeTipo(registro, Clase) {
    // Obtener las propiedades de la clase
    const propiedadesClase = Object.keys(new Clase());

    // Valido si todas las propiedades estan presentes en el registro
    return propiedadesClase.every(propiedad => registro.hasOwnProperty(propiedad));
}

function procesarRegistros(lista) {
    const listaObjetos = [];

    lista.forEach(elemento => {
        if (esRegistroDeTipo(elemento, Heroe)) {
            // Asumiendo que el constructor de Heroe espera argumentos separados
            const heroe = new Heroe(
                elemento.id,
                elemento.nombre,
                elemento.apellido,
                elemento.edad,
                elemento.alterego,
                elemento.ciudad,
                elemento.publicado
            );
            listaObjetos.push(heroe); // Agregar el nuevo objeto Heroe a la lista
        } else {
            // Asumiendo que el constructor de Villano espera argumentos separados
            const villano = new Villano(
                elemento.id,
                elemento.nombre,
                elemento.apellido,
                elemento.edad,
                elemento.enemigo,
                elemento.robos,
                elemento.asesinatos
            );
            listaObjetos.push(villano); // Agregar el nuevo objeto Villano a la lista
        }
    });

    return listaObjetos;
}

function filtrarYMostrarDatos(lista, Clase) {
    // Filtrar los datos basándose en el tipo seleccionado
    datosFiltrados = lista.filter(persona => persona instanceof Clase);

    // Llamar a la función updateTable con los datos filtrados
    updateTable($seccionTabla, datosFiltrados, colorHeader, identificador, titulo);
}

function cambiarVisibilidad() {
    let form = document.getElementById("formulario");
    let tabla = document.getElementById("tabla");
    let encabezado = document.getElementById("encabezado");
    let boton = document.getElementById("alta");

    if (form.style.display == "") {
        // se oculta el formulario y se muestra la tabla
        form.style.display = "none";
        encabezado.style.display = "";
        tabla.style.display = "";
        boton.value = "Alta";
        boton.textContent = "Alta";
        resetFormulario($formulario);
        resetCheckbox();
    }
    else {
        form.style.display = "";
        tabla.style.display = "none";
        encabezado.style.display = "none";
        boton.value = "Volver";
        boton.textContent = "Volver";
    }
}

function cargarFormulario(formulario, usuario) {
    const $boton = document.getElementById("accion");
    const $botonEliminar = document.getElementById("eliminar");
    $botonEliminar.style.display = "block";
    $boton.value = "Modificar";

    if(usuario instanceof Villano){
        select.value = "Villano"
        crearInputs();

        formulario.enemigo.value = usuario.enemigo;
        formulario.robos.value = usuario.robos;
        formulario.asesinatos.value = usuario.asesinatos;
    }
    else{
        select.value = "Heroe"
        crearInputs();
        formulario.alterego.value = usuario.alterego;
        formulario.ciudad.value = usuario.ciudad;
        formulario.publicado.value = usuario.publicado;
    }
    formulario.id.value = usuario.id;
    formulario.nombre.value = usuario.nombre;
    formulario.apellido.value = usuario.apellido;
    formulario.edad.value = usuario.edad;
}

function resetFormulario(formulario) {
    const $boton = document.getElementById("accion");
    const $botonEliminar = document.getElementById("eliminar");
    $botonEliminar.style.display = "none";
    $boton.value = "Alta";
    formulario.reset();
}