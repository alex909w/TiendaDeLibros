// Función para cargar el archivo JSON y guardarlo en localStorage
async function cargarLibros() {
    try {
        // Primero verificamos si ya existe en localStorage
        const librosGuardados = localStorage.getItem('libros');
        if (librosGuardados) {
            return JSON.parse(librosGuardados);
        }

        // Si no existe, cargamos del archivo JSON
        const response = await fetch('libros.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        const libros = await response.json();
        
        // Guardamos en localStorage
        localStorage.setItem('libros', JSON.stringify(libros));
        return libros;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar los libros en la consola
async function mostrarLibros() {
    const libros = await cargarLibros();
    if (libros) {
        console.log(libros);
    }
}

// Llamar a la función para mostrar los libros
mostrarLibros();

async function mostrarLibrosEnTienda() {
    const contenedor = document.getElementById('productos');
    const data = await cargarLibros();
    
    if (data && data.libros) {
        let html = '';
        data.libros.forEach((libro, index) => {
            html += `
                <div class="producto">
                    <img src="${libro.img}" alt="${libro.titulo}" class="imagen-producto">
                    <h3>${libro.titulo}</h3>
                    <p>Autor: ${libro.autor}</p>
                    <p>Precio: $${libro.precio.toFixed(2)}</p>
                    <p>Disponibles: <span id="cantidad-${index}">${libro.cantidad}</span></p>
                    <input type="number" class="form-controls" id="cantidad-seleccionada-${index}" 
                        min="1" max="${libro.cantidad}" value="1">
                    <button onclick="actualizarInventario(${index})">
                        Agregar al carrito
                    </button>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }
}

// Función para actualizar el inventario cuando se agrega al carrito
function actualizarInventario(index) {
    const libros = JSON.parse(localStorage.getItem('libros'));
    const cantidadSeleccionada = parseInt(document.getElementById(`cantidad-seleccionada-${index}`).value);
    
    if (!libros || !libros.libros[index]) {
        console.error('No se encontró el libro');
        return;
    }

    if (libros.libros[index].cantidad >= cantidadSeleccionada) {
        // Actualizar cantidad en localStorage
        libros.libros[index].cantidad -= cantidadSeleccionada;
        localStorage.setItem('libros', JSON.stringify(libros));
        
        // Actualizar display
        document.getElementById(`cantidad-${index}`).textContent = libros.libros[index].cantidad;
        
        // Agregar al carrito con información completa del libro
        const libro = libros.libros[index];
        agregarAlCarrito({
            titulo: libro.titulo,
            precio: libro.precio,
            cantidad: cantidadSeleccionada,
            img: libro.img,
            autor: libro.autor
        });

        // Mostrar mensaje de éxito
        alert(`Se agregaron ${cantidadSeleccionada} unidades de "${libro.titulo}" al carrito`);
    } else {
        alert('No hay suficiente stock disponible');
    }
}

// Función para agregar al carrito
function agregarAlCarrito(item) {
    try {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si el libro ya existe en el carrito
        const index = carrito.findIndex(i => i.titulo === item.titulo);
        
        if (index !== -1) {
            // Si existe, actualizar cantidad
            carrito[index].cantidad += item.cantidad;
        } else {
            // Si no existe, agregar nuevo item
            carrito.push(item);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar contador del carrito
        const contador = document.getElementById('contador-carrito');
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        
        return true;
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        alert('Hubo un error al agregar al carrito');
        return false;
    }
}

// Agregar esta función para verificar el estado del carrito
function mostrarEstadoCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log('Estado actual del carrito:', carrito);
}

// Inicializar la tienda cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarLibrosEnTienda();
    mostrarEstadoCarrito(); // Para debug
});