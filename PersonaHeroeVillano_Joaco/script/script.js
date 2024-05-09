import { lista } from "./data.js";
import {Villano} from "./entidades/villano.js"
import {Heroe} from "./entidades/heroe.js";
import {createForm,resetForm,crearInputs} from "./form.js";
import { updateTable, createTable} from "./tabla.js";

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
//Agrego el formulario como primer hijo
$seccionFormulario.insertBefore(createForm(listaObjetos,colorHeader,identificador,tipos), $seccionFormulario.firstChild);

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
    }
    else if (e.target.matches('th')) {
        handlerSelectedTH(e);
        console.log(datosFiltrados);
    }
    else if (e.target.id === 'btnCalcularEdadPromedio') {
        
        let edadPromedio = calcularEdadPromedio(datosFiltrados);
        let inputText = document.getElementById('edadPromedio');
        inputText.value = edadPromedio;
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

function updateColumnStyle(columnClass,checkbox) {
    const columns = document.querySelectorAll(`.${columnClass}Th`);
    columns.forEach(column => {
        // Asegúrate de que 'column' no sea undefined antes de intentar acceder a su propiedad 'style'
        if (column) {
            column.style.display = checkbox.checked?  '':'none';
        }
    });
}

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
});

select.addEventListener("change", crearInputs);

let btnAlta = document.getElementById("alta");
btnAlta.addEventListener("click", cambiarVisibilidad);

// FUNCIONES

function handlerSelectedTD(e) {
    const selector = e.target.parentElement.dataset.id;
    console.log(selector);
    // const selectedSuperHeroe = superheroes.find((SuperHeroe) => SuperHeroe.id == selector);
    // if (!document.getElementById('boton-cancelar')) {
    //     const $botonera = document.getElementById('botonera');
    //     const botonCancelar = document.createElement('input');
    //     botonCancelar.type = 'reset';
    //     botonCancelar.value = 'Cancelar';
    //     botonCancelar.id = 'boton-cancelar';
    //     botonCancelar.classList.add('cancelar');
    //     $botonera.appendChild(botonCancelar);
    // }
    // cargarFormulario($formulario, selectedSuperHeroe);
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
    }
    else {
        form.style.display = "";
        tabla.style.display = "none";
        encabezado.style.display = "none";
        boton.value = "Volver";
        boton.textContent = "Volver";
    }
}