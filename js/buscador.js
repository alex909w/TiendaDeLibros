document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.getElementById('busqueda');
    const botonBuscar = document.getElementById('boton-buscar');

    function realizarBusqueda() {
        const terminoBusqueda = inputBusqueda.value.toLowerCase().trim();
        const productos = document.querySelectorAll('.producto');

        productos.forEach(producto => {
            const titulo = producto.querySelector('h3').textContent.toLowerCase();
            const autor = producto.querySelector('p').textContent.toLowerCase();
            
            if (titulo.includes(terminoBusqueda) || autor.includes(terminoBusqueda)) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }

    botonBuscar.addEventListener('click', realizarBusqueda);
    inputBusqueda.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
});