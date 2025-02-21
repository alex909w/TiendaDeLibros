// Función para cargar los productos del carrito
function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedorCarrito = document.getElementById("carrito");
  const totalCarrito = document.getElementById("total-carrito");

  let html = "";
  let subtotalGeneral = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    subtotalGeneral += subtotal;
    html += `
      <div class="item-carrito">
          <img src="${item.img}" alt="${item.titulo}" class="imagen-carrito">
          <div class="info-carrito">
              <h3>${item.titulo}</h3>
              <p>Precio unitario: $${item.precio.toFixed(2)}</p>
              <p>Cantidad: ${item.cantidad}</p>
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
              <button class="btn-reduce-custom" onclick="reducirCantidad('${item.titulo}')">Reducir cantidad</button>
              <button class="btn-add-custom" onclick="aumentarCantidad('${item.titulo}')">Aumentar cantidad</button>
          </div>
      </div>
    `;
  });

  const iva = subtotalGeneral * 0.13;
  const total = subtotalGeneral + iva;

  html += `
    <div class="contenedor-tabla">
      <table class="tabla-resumen">
        <tr>
          <td>Subtotal</td>
          <td>$${subtotalGeneral.toFixed(2)}</td>
        </tr>
        <tr>
          <td>IVA (13%)</td>
          <td>$${iva.toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Total con IVA</strong></td>
          <td><strong>$${total.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>
  `;

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
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  Swal.fire({
    title: "¡Compra realizada!", 
    text: "Gracias por tu compra. ¿Deseas generar la factura?",
    icon: "success",
    showCancelButton: true,
    confirmButtonText: "Sí, generar factura",
    cancelButtonText: "No, volver al inicio"
  }).then((result) => {
    if (result.isConfirmed) {
      generarFacturaPDF(carrito); 
    }

    localStorage.removeItem("carrito"); 
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000); 
  });
}

// Función para generar el PDF de la factura
function generarFacturaPDF() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.13;
  const total = subtotal + iva;

  // Crear documento PDF
  const doc = new jspdf.jsPDF();
  
  // Configurar fuentes y estilos
  doc.setFont("helvetica");
  
  // Encabezado con datos de la tienda
  doc.setFontSize(22);
  doc.text("El Binario", 105, 20, {align: "center"});
  doc.setFontSize(12);
  doc.text("Librería Especializada", 105, 28, {align: "center"});
  doc.setFontSize(10);
  doc.text([
    "Calle Principal #123",
    "Tel: (555) 123-4567",
    "Email: contacto@elbinario.com",
    "www.elbinario.com"
  ], 105, 35, {align: "center"});

  // Línea divisoria
  doc.line(20, 50, 190, 50);

  // Información de la factura
  doc.setFontSize(14);
  doc.text("FACTURA", 20, 60);
  
  const fecha = new Date().toLocaleDateString();
  const numeroFactura = Date.now().toString().slice(-8);
  doc.setFontSize(10);
  doc.text([
    `Fecha: ${fecha}`,
    `N° Factura: ${numeroFactura}`
  ], 20, 70);

  // Tabla de productos
  doc.setFontSize(11);
  let y = 90;
  
  // Encabezados de tabla
  doc.setFont("helvetica", "bold");
  doc.text("Producto", 20, y);
  doc.text("Cant.", 120, y);
  doc.text("Precio Unit.", 140, y);
  doc.text("Subtotal", 170, y);
  
  // Línea bajo encabezados
  y += 2;
  doc.line(20, y, 190, y);
  y += 10;

  // Productos
  doc.setFont("helvetica", "normal");
  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    doc.text(item.titulo, 20, y);
    doc.text(item.cantidad.toString(), 120, y);
    doc.text(`$${item.precio.toFixed(2)}`, 140, y);
    doc.text(`$${subtotal.toFixed(2)}`, 170, y);
    y += 8;
  });

  // Total
  y += 5;
  doc.line(20, y, 190, y);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 170, y);
  y += 8;
  doc.text(`IVA (13%): $${iva.toFixed(2)}`, 170, y);
  y += 8;
  doc.text(`Total: $${total.toFixed(2)}`, 170, y);

  // Pie de página
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("¡Gracias por su compra!", 105, 270, {align: "center"});
  doc.text("* Este documento es una factura simplificada", 105, 275, {align: "center"});

  // Guardar PDF
  doc.save("factura_ElBinario.pdf");
}
// Cargar el carrito al abrir la página
document.addEventListener("DOMContentLoaded", cargarCarrito);
