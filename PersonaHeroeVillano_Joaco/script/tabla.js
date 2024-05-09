
export const createTable = (data, colorHeader, identidicador) => {

    const table = document.getElementById('tabla');

    let propiedades = data.reduce((acumulador, objetoActual) => {
        Object.keys(objetoActual).forEach(propiedad => {
          if (!acumulador.includes(propiedad)) {
            acumulador.push(propiedad);
          }
        });
        return acumulador;
      }, []);

    if (!Array.isArray(data) || data.length < 1) return null;

    table.appendChild(createHeaderTable(colorHeader, propiedades));
    table.appendChild(createBodyTable(data, identidicador,propiedades));
    
    return table;
};

const createHeaderTable = (color, propiedades) => {
    const tHead = document.createElement('thead');
    const headRow = document.createElement('tr');
    // const checkboxes = document.querySelectorAll('.showColumn input[type="checkbox"]');

    propiedades.forEach(propiedad => {
        
      const th = document.createElement('th');
      th.textContent = propiedad;
      th.className = `${propiedad}ColTh`;
      headRow.appendChild(th);
    });
    headRow.style.setProperty("background-color", color);

    tHead.appendChild(headRow);

    return tHead;
};

const createBodyTable = (data, identificador, propiedades) => {
    const tBody = document.createElement('tbody');

    data.forEach((elemento, index) => {
        const tr = document.createElement('tr');

        if (index % 2 == 0) tr.classList.add('filaPar');

        propiedades.forEach(propiedad => {
            const td = document.createElement('td');
            if (propiedad === identificador) {
                tr.setAttribute(`data-id`, elemento[propiedad]);
            }
            td.textContent = elemento[propiedad] || ''; 
            td.className = `${propiedad}ColTh`;
            tr.appendChild(td);
        });
        tBody.appendChild(tr);
    });

    return tBody;
};

export const updateTable = (contenedor, data, colorHeader, identidicador, titulo, opciones) => {

    const $tabla = document.getElementById('tabla');

    while ($tabla.hasChildNodes()) {
        $tabla.removeChild($tabla.firstChild);
    }

    createTable(data, colorHeader, identidicador,opciones);
};