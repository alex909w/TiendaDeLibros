// Función para cargar los productos del carrito
function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedorCarrito = document.getElementById("carrito");
  const totalCarrito = document.getElementById("total-carrito");

  let html = "";
  let total = 0;

  carrito.forEach((item) => {
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
              <button onclick="reducirCantidad('${
                item.nombre
              }')">Reducir cantidad</button>
              <button onclick="aumentarCantidad('${
                item.nombre
              }')">Aumentar cantidad</button>
          </div>
      </div>
      `;
  });

  contenedorCarrito.innerHTML = html;
  totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// Función para incrementar la cantidad de un productos en el carrito.
function aumentarCantidad(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let producto = carrito.find((item) => item.nombre === nombre);

  if (producto) {
    producto.cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
  }
}

// Función para reducir la cantidad de un productos en el carrito.
function reducirCantidad(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productoIndex = carrito.findIndex((item) => item.nombre === nombre);

  if (productoIndex !== -1) {
    if (carrito[productoIndex].cantidad > 1) {
      carrito[productoIndex].cantidad--;
    } else {
      carrito.splice(productoIndex, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
  }
}

// Función para finalizar la compra
function finalizarCompra() {
  alert("¡Gracias por tu compra!");
  localStorage.removeItem("carrito");
  window.location.href = "index.html";
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.getElementById("contador-carrito").textContent = contador;
}

// Cargar el carrito al abrir la página
document.addEventListener("DOMContentLoaded", cargarCarrito);
