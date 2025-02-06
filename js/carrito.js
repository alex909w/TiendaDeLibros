const productos = [
    { id: 1, nombre: "El Principito", precio: 10, stock: 10, imagen: "img/ElPrincipito.jpg" },
    { id: 2, nombre: "Harry Potter y la Piedra Filosofal", precio: 15, stock: 8, imagen: "img/harry.webp" }, 
    { id: 3, nombre: "Cien años de soledad", precio: 22, stock: 7, imagen: "img/CienAñosDeSoledad.jpg" },
    { id: 4, nombre: "1984 - George Orwell", precio: 18, stock: 10, imagen: "img/1984.jpg" },
];

   let carrito = [];
   function agregarAlCarrito(nombre, precio, idCantidad, idCantidadSeleccionada) {
    let cantidadSeleccionada =
   parseInt(document.getElementById(idCantidadSeleccionada).value);
    let cantidadDisponible = parseInt(document.getElementById(idCantidad).textContent);
    if (cantidadSeleccionada > cantidadDisponible) {
    cantidadSeleccionada = cantidadDisponible;
    }

    let productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
    productoExistente.cantidad += cantidadSeleccionada;
    } else {
    const producto = productos.find(p => p.nombre === nombre);
    carrito.push({
    nombre: nombre,
    precio: precio,
    cantidad: cantidadSeleccionada,
    imagen: producto.imagen
    });
    }

    const producto = productos.find(p => p.nombre === nombre);
    producto.stock -= cantidadSeleccionada;
    document.getElementById(idCantidad).textContent = producto.stock;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
   }

   function actualizarContadorCarrito() {
    let contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById("contador-carrito").textContent = contador;
   }