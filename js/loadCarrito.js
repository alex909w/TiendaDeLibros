function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById('carrito');
    const totalCarrito = document.getElementById('total-carrito');
    let html = '';
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
    <div class="item-carrito">
        <img src="${item.imagen}" alt="${item.nombre}" class="imagen-carrito">
        <div class="info-carrito">
            <h3>${item.nombre}</h3>
        <p>Precio unitario: $${item.precio.toFixed(2)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <button onclick="reducirCantidad('${item.nombre}')">Reducir cantidad</button>
            <button onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
        </div>
    </div>
    `;
    });
    contenedorCarrito.innerHTML = html;
    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

function eliminarDelCarrito(nombre) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Filtrar el carrito para eliminar el item con el nombre indicado
    carrito = carrito.filter(item => item.nombre !== nombre);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Recargar la vista del carrito
    cargarCarrito();
}

function reducirCantidad(nombre) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar el item y reducir su cantidad
    carrito = carrito.map(item => {
        if (item.nombre === nombre) {
            if (item.cantidad > 1) {
                item.cantidad -= 1;
            } else {
                return null; // Marcar para eliminar
            }
        }
        return item;
    }).filter(item => item !== null); // Eliminar elementos nulos (los que tenían cantidad 1)

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Recargar la vista del carrito
    cargarCarrito();
}


document.addEventListener('DOMContentLoaded', cargarCarrito);