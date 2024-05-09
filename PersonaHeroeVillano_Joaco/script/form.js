import { Heroe } from "./entidades/heroe.js";
import { Villano } from "./entidades/villano.js";

export const createForm = (data, color, identidicador,tipos) => {

    if (!Array.isArray(data) || data.length < 1) return null;

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('group-form');

    const form = document.createElement('form');
    fieldset.appendChild(form);

    // let propiedades = data.reduce((acumulador, objetoActual) => {
    //     Object.keys(objetoActual).forEach(propiedad => {
    //       if (!acumulador.includes(propiedad)) {
    //         acumulador.push(propiedad);
    //       }
    //     });
    //     return acumulador;
    //   }, []);

    // Crear un select
    const select = document.createElement('select');
    const div = document.createElement('div');

    select.id = "select";
    select.name = "tipo";

    // Agregar opciones al select basadas en los tipos de datos
    tipos.forEach(objetoActual => {
        const option = document.createElement('option');
        option.value = objetoActual;
        option.text = objetoActual;
        select.appendChild(option);
    });
    div.appendChild(select);
    form.appendChild(div);

    return fieldset;
};

// Crea los inputs y lebels del formulario de manera dinamica dependiendo del valor del selector
export const crearInputs = () => {
    let propiedades = [];
    let form = document.querySelector("form");
    let select = document.querySelector('[name="tipo"]');

    if (select.value === "Heroe") {
        propiedades = Object.getOwnPropertyNames(new Heroe());
    } else if (select.value === "Villano") {
        propiedades = Object.getOwnPropertyNames(new Villano());
    }

    // Seleccionar todos los inputs y labels existentes en el formulario
    const existingInputs = document.querySelectorAll('form input');
    const existingLabels = document.querySelectorAll('form label');
    const existingBr = document.querySelectorAll('form br');

    if(existingInputs && existingLabels){
        existingInputs.forEach(input => input.remove());
        existingLabels.forEach(label => label.remove());
        existingBr.forEach(label => label.remove());
    }

    // Genero el formulario de manera dinamica
    propiedades.forEach(propiedad => {
        // Crear el label
        const div = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = propiedad.charAt(0).toUpperCase() + propiedad.slice(1); // Asegura que la primera letra esté en mayúscula

        // Crear el input
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input' 
        input.id = propiedad; 

        label.setAttribute('for', propiedad);
        // Añadir el label y el input al formulario
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
        div.appendChild(input);
        form.appendChild(div);
        form.appendChild(document.createElement('br'));
    });
};

export function resetForm(form) {

};