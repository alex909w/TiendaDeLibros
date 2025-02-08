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

function limpiarCampos () {
    document.getElementById('titulo').value = "",
    document.getElementById('autor').value = "",
    document.getElementById('categoria').value = "",
    document.getElementById('precio') = "",
    document.getElementById('cantidad') = "",
    document.getElementById('img').value = ""
}