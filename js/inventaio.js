document.getElementById('btnAgregar').addEventListener('click', function() {
    const item = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        categoria: document.getElementById('categoria').value.trim(),
        precio: document.getElementById('precio').value,
        cantidad: document.getElementById('cantidad').value,
        img: document.getElementById('img').value.trim()
    };
    guardarLibrosEnLocalStorage(item); // Guarda en localStorage con formato correcto
});


function guardarLibrosEnLocalStorage(item) {
    try {
        // Verificar que tenemos todos los datos necesarios
        if (!item || !item.titulo || !item.precio || !item.cantidad || !item.categoria) {
            Swal.fire({
                title: "Campos vacios",
                text: "Debe llenar todos los campos",
                icon: "error"
              });
        } else {
            // Obtener los libros almacenados en localStorage
            let data = JSON.parse(localStorage.getItem('libros')) || { libros: [] };

            // Buscar si el libro ya existe en la lista
            const index = data.libros.findIndex(libro => libro.titulo === item.titulo);

            if (index !== -1) {
                // Si el libro ya existe, solo actualizamos la cantidad
                data.libros[index].cantidad += item.cantidad;
            } else {
                // Si el libro no existe, lo agregamos a la lista
                data.libros.push({
                    img: item.img || "/img/default.jpg",
                    titulo: item.titulo,
                    autor: item.autor || "Autor desconocido",
                    categoria: item.categoria,
                    precio: parseFloat(item.precio),
                    cantidad: parseInt(item.cantidad)
                });
            }

            // Guardar en localStorage con el formato correcto
            localStorage.setItem('libros', JSON.stringify(data));
            console.log("Libro guardado correctamente en localStorage.", data);
            Swal.fire({
                title: "Nuevo registro",
                text: "Registro agregado con exito!",
                icon: "info"
            });
            limpiarCampos();
        }

    } catch (error) {
        console.error('Error al guardar libro en localStorage:', error);
        Swal.fire({
            title: "Error de inserccion",
            text: "Hubo un error al guardar el libro.",
            icon: "error"
        });
    }
}

function mostrarLibrosEnTabla() {
    const data = JSON.parse(localStorage.getItem('libros')) || { libros: [] };
    const tabla = document.getElementById('tablaLibros'); // Asegúrate de tener una tabla en tu HTML

    tabla.innerHTML = `<thead>
                  <tr>
                     <th>Título</th>
                     <th>Autor</th>
                     <th>Categoría</th>
                     <th>Precio</th>
                     <th>Cantidad</th>
                     <th>Actualizar</th>
                     <th>Eliminar</th>
                  </tr>
               </thead>`;

    data.libros.forEach((libro, index) => {
        const row = tabla.insertRow();  // Insertar una nueva fila en la tabla

        // Insertar celdas en la fila
        row.insertCell(0).innerText = libro.titulo;
        row.insertCell(1).innerText = libro.autor;
        row.insertCell(2).innerText = libro.categoria;
        row.insertCell(3).innerText = libro.precio.toFixed(2);
        row.insertCell(4).innerText = libro.cantidad;

        // Botón para actualizar cantidad
        const actualizarBtn = document.createElement('button');
        actualizarBtn.innerText = 'Actualizar';
        actualizarBtn.classList.add('btn', 'btn-info')
        actualizarBtn.onclick = function() { actualizarCantidad(index); };
        row.insertCell(5).appendChild(actualizarBtn);

        // Botón para eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.innerText = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-danger')
        eliminarBtn.onclick = function() { eliminarLibro(index); };
        row.insertCell(6).appendChild(eliminarBtn);
    });
}

function eliminarLibro(index) {
    try {
        let data = JSON.parse(localStorage.getItem('libros')) || { libros: [] };
        data.libros.splice(index, 1);  // Eliminar el libro de la lista

        // Guardar los cambios en localStorage
        localStorage.setItem('libros', JSON.stringify(data));
        Swal.fire({
            title: "Eliminados correctamente!",
            icon: "success",
            draggable: true
        });

        // Volver a mostrar los libros actualizados
        mostrarLibrosEnTabla();
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}

async function solicitarCantidad() {
    const { value: nuevaCantidad } = await Swal.fire({
        title: "Cantidad a agregar",
        input: "number", // Cambiado a tipo "number" para restringir entrada
        inputAttributes: {
            min: "1", // Evita valores negativos o cero
            step: "1"
        },
        showCancelButton: true, // Agrega botón de cancelar
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
            if (!value || isNaN(value) || value <= 0) {
                return "Por favor, ingresa una cantidad válida.";
            }
        }
    });

    if (nuevaCantidad) {
        console.log("Cantidad ingresada:", nuevaCantidad);
        return parseInt(nuevaCantidad, 10); // Retorna la cantidad como número
    } else {
        console.log("Operación cancelada");
        return null;
    }
}


function actualizarCantidad(index) {
    // Uso de la función:
    solicitarCantidad().then((cantidad) => {
        if (cantidad !== null) {
            console.log("Procesando cantidad:", cantidad);

            // const nuevaCantidad = prompt("Ingrese la nueva cantidad:");
            if (cantidad !== null && !isNaN(cantidad) && parseInt(cantidad) >= 0) {
                try {
                    let data = JSON.parse(localStorage.getItem('libros')) || { libros: [] };
                    data.libros[index].cantidad = parseInt(cantidad);  // Actualizar la cantidad

                    Swal.fire({
                        title: "Actualizado correctamente!",
                        icon: "success",
                        draggable: true
                    });

                    // Guardar los cambios en localStorage
                    localStorage.setItem('libros', JSON.stringify(data));

                    // Volver a mostrar los libros actualizados
                    mostrarLibrosEnTabla();
                } catch (error) {
                    console.error('Error al actualizar la cantidad del libro:', error);
                    Swal.fire({
                        title: "Error al actualizar la cantidad del libro!",
                        icon: "error",
                        draggable: true
                    });
                }
            } else {
                Swal.fire({
                    title: "Ingresa una cantidad valida!",
                    icon: "error",
                    draggable: true
                });
            }
        }
    });
}

function limpiarCampos() {
    document.getElementById('titulo').value = "";
    document.getElementById('autor').value = "";
    document.getElementById('categoria').value = "";
    document.getElementById('precio').value = "";  // Corregido
    document.getElementById('cantidad').value = "";  // Corregido
    document.getElementById('img').value = "";
}
document.addEventListener('DOMContentLoaded', mostrarLibrosEnTabla);