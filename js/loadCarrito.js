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
          <img src="${item.img}" alt="${item.titulo}" class="imagen-carrito">
          <div class="info-carrito">
              <h3>${item.titulo}</h3>
              <p>Precio unitario: $${item.precio.toFixed(2)}</p>
              <p>Cantidad: ${item.cantidad}</p>
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
              <button class = "btn-reduce-custom" onclick="reducirCantidad('${
                item.titulo
              }')">Reducir cantidad</button>
              <button class = "btn-add-custom" onclick="aumentarCantidad('${
                item.titulo
              }')">Aumentar cantidad</button>
          </div>
      </div>
      `;
  });

  contenedorCarrito.innerHTML = html;
  totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// Función para incrementar la cantidad de un producto en el carrito.
function aumentarCantidad(titulo) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let producto = carrito.find((item) => item.titulo === titulo);

  if (producto) {
    producto.cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
  }
}

// Función para reducir la cantidad de un producto en el carrito.
function reducirCantidad(titulo) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productoIndex = carrito.findIndex((item) => item.titulo === titulo);

  if (productoIndex !== -1) {
    if (carrito[productoIndex].cantidad > 1) {
      carrito[productoIndex].cantidad--;
    } else {
      carrito.splice(productoIndex, 1); // Eliminar producto si la cantidad llega a 0
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
  }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.getElementById("carrito").textContent = contador;
}

// Función para finalizar la compra y opciones de generar factura
function finalizarCompra() {
  Swal.fire({
    title: "¡Compra realizada!", 
    text: "Gracias por tu compra. ¿Deseas generar la factura?",
    icon: "success",
    showCancelButton: true,
    confirmButtonText: "Sí, generar factura",
    cancelButtonText: "No, volver al inicio"
  }).then((result) => {
    if (result.isConfirmed) {
      generarFacturaPDF();
    }
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
  });
}
// Función para generar el PDF de la factura
function generarFacturaPDF() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // Crear un nuevo documento PDF
  const doc = new jspdf.jsPDF();

  // Agregar el título de la factura
  doc.setFontSize(18);
  doc.text("Factura de Compra", 10, 10);

  // Agregar la fecha de la compra
  const fecha = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Fecha: ${fecha}`, 10, 20);

  // Agregar los detalles de los productos
  let y = 30;
  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    doc.text(`${item.titulo} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precio.toFixed(2)} - Subtotal: $${subtotal.toFixed(2)}`, 10, y);
    y += 10;
  });
   // Agregar el total de la compra
  doc.setFontSize(14);
  doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

  // Guardar el factura en PDF
  doc.save("factura.pdf");
}
// Cargar el carrito al abrir la página
document.addEventListener("DOMContentLoaded", cargarCarrito);
