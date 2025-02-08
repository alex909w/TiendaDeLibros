// Función para depurar el estado del localStorage
function debugLocalStorage() {
    console.log('Estado del localStorage:');
    console.log('Libros:', JSON.parse(localStorage.getItem('libros')));
    console.log('Carrito:', JSON.parse(localStorage.getItem('carrito')));
}

document.getElementById('btnAgregar').addEventListener('click', function() {
    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const precio = document.getElementById('precio').value;
    const cantidad = document.getElementById('cantidad').value;

    // Validar que los campos requeridos no estén vacíos
    if (!titulo || !precio || !cantidad) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const libro = {
        titulo: titulo,
        autor: autor || 'Autor desconocido',
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        img: '' // Puedes agregar lógica para incluir una imagen si es necesario
    };

    // Llamar a la función para agregar al carrito
    if (agregarAlCarrito(libro)) {
        alert('Libro agregado al carrito correctamente.');
    }
});

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log(`Carrito actualizado. Total de libros: ${carrito.length}`);
}

function debugLocalStorage() {
    console.log('Estado actual del carrito:', localStorage.getItem('carrito'));
}

function agregarAlCarrito(item) {
    try {
        // Verificar que tenemos todos los datos necesarios
        console.log('Datos recibidos:', item);
        
        if (!item || !item.titulo || !item.precio || !item.cantidad) {
            throw new Error('Datos incompletos del libro');
        }

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si el libro ya existe en el carrito
        const index = carrito.findIndex(i => i.titulo === item.titulo);
        
        if (index !== -1) {
            // Si existe, actualizar cantidad
            carrito[index].cantidad += item.cantidad;
        } else {
            // Si no existe, agregar nuevo item
            carrito.push({
                titulo: item.titulo,
                precio: parseFloat(item.precio),
                cantidad: parseInt(item.cantidad),
                img: item.img || '',
                autor: item.autor || 'Autor desconocido'
            });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
        debugLocalStorage(); // Depurar estado después de agregar
        return true;

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        console.error('Datos del item:', item);
        alert('Hubo un error al agregar al carrito');
        return false;
    }
}

// Modificar la función actualizarContadorCarrito para incluir depuración
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        console.log('Contador actualizado:', totalItems);
    } else {
        console.error('No se encontró el elemento contador-carrito');
    }
}

// Función para cargar y mostrar los items del carrito
function mostrarItemsCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.querySelector('.carrito');
    
    if (!contenedor) {
        console.error('No se encontró el contenedor del carrito');
        return;
    }

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="item-carrito">
                <img src="${item.img}" alt="${item.titulo}" class="imagen-carrito">
                <div class="info-item">
                    <h3>${item.titulo}</h3>
                    <p>Autor: ${item.autor}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p>Precio unitario: $${item.precio.toFixed(2)}</p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    });

    html += `
        <div class="resumen-carrito">
            <h3>Total a pagar: $${total.toFixed(2)}</h3>
            <button onclick="finalizarCompra()" class="btn-comprar">
                Finalizar Compra
            </button>
            <button onclick="vaciarCarrito()" class="btn-vaciar">
                Vaciar Carrito
            </button>
        </div>
    `;

    contenedor.innerHTML = html;
    actualizarContadorCarrito();
}

// Función para eliminar un item del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const itemEliminado = carrito[index];
    
    // Devolver items al inventario
    let libros = JSON.parse(localStorage.getItem('libros'));
    const libroIndex = libros.libros.findIndex(libro => libro.titulo === itemEliminado.titulo);
    
    if (libroIndex !== -1) {
        libros.libros[libroIndex].cantidad += itemEliminado.cantidad;
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    // Eliminar del carrito
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    mostrarItemsCarrito();
    actualizarContadorCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Devolver todos los items al inventario
        let libros = JSON.parse(localStorage.getItem('libros'));
        carrito.forEach(item => {
            const libroIndex = libros.libros.findIndex(libro => libro.titulo === item.titulo);
            if (libroIndex !== -1) {
                libros.libros[libroIndex].cantidad += item.cantidad;
            }
        });
        
        localStorage.setItem('libros', JSON.stringify(libros));
        localStorage.setItem('carrito', JSON.stringify([]));
        
        mostrarItemsCarrito();
        actualizarContadorCarrito();
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    if (confirm('¿Deseas finalizar tu compra?')) {
        // Aquí podrías agregar lógica adicional para el proceso de pago
        localStorage.setItem('carrito', JSON.stringify([]));
        alert('¡Gracias por tu compra!');
        mostrarItemsCarrito();
        actualizarContadorCarrito();
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    debugLocalStorage(); // Depurar estado inicial
    mostrarItemsCarrito();
    actualizarContadorCarrito();
});