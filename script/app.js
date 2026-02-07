const productosContainer = document.getElementById('productos');
let todosLosProductos = [];

document.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
    configurarBuscador();
});

async function cargarProductos() {
    try {
        if (typeof API === 'undefined') {
            console.error('API no cargada');
            return;
        }

        const productos = await API.obtenerProductos();
        todosLosProductos = productos;

        if (productos.length === 0) {
            mostrarProductosVacios();
            return;
        }

        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarProductosVacios();
    }
}

function mostrarProductos(productos) {
    if (!productosContainer) return;

    productosContainer.innerHTML = '';

    if (productos.length === 0) {
        productosContainer.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #666;">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra búsqueda</p>
            </div>
        `;
        return;
    }

    productos.forEach(producto => {
        const precioFormateado = Utils.formatearPrecio(producto.fields.price || 0);
        const prodData = {
            id: producto.id,
            name: producto.fields.name || '',
            price: producto.fields.price || 0,
            image: producto.fields.image || ''
        };

        const productoHTML = `
            <article class="product-item" onclick="irADetalle('${prodData.id}', '${prodData.name.replace(/'/g, "\\'")}', ${prodData.price}, '${prodData.image}')">
                <figure class="product-item__img">
                    <img src="${prodData.image || '/img/Defecto.webp'}" 
                         alt="${prodData.name || 'Producto'}"
                         onerror="this.src='/img/Defecto.webp';">
                </figure>
                <div class="product-item__info">
                    <i class="fa-solid fa-truck"></i>
                    <p class="info-price">${precioFormateado}</p>
                    <p class="info-discount">20% OFF</p>
                </div>
                <div class="product-item__title">
                    <h3>${prodData.name}</h3>
                </div>
                <div class="product-item__button">
                    <button class="buy-button" onclick="event.stopPropagation(); agregarAlCarritoDesdeHTML('${prodData.id}', '${prodData.name.replace(/'/g, "\\'")}', ${prodData.price}, '${prodData.image}')">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;

        productosContainer.innerHTML += productoHTML;
    });
}

function configurarBuscador() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    if (!searchInput || !searchButton) return;

    searchInput.addEventListener('input', function () {
        filtrarProductos(this.value);
    });

    searchButton.addEventListener('click', function () {
        filtrarProductos(searchInput.value);
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filtrarProductos(this.value);
        }
    });
}

function filtrarProductos(texto) {
    if (!texto || texto.trim() === '') {
        mostrarProductos(todosLosProductos);
        return;
    }

    const textoBusqueda = texto.toLowerCase().trim();
    const productosFiltrados = todosLosProductos.filter(producto => {
        const nombre = (producto.fields.name || '').toLowerCase();
        const precio = (producto.fields.price || 0).toString();
        return nombre.includes(textoBusqueda) || precio.includes(textoBusqueda);
    });

    mostrarProductos(productosFiltrados);
}

function mostrarProductosVacios() {
    productosContainer.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #666;">
            <h3>No hay productos disponibles</h3>
            <p>Pronto tendremos nuevos productos para ti</p>
        </div>
    `;
}

function agregarAlCarritoDesdeHTML(id, nombre, precio, imagen) {
    if (window.carrito) {
        window.carrito.agregarProducto({
            id: id,
            name: nombre,
            price: precio,
            image: imagen,
            quantity: 1
        });
    } else {
        console.error('El carrito no está inicializado');
    }
}

function irADetalle(id, nombre, precio, imagen) {
    const params = new URLSearchParams({
        id: id,
        name: nombre,
        price: precio,
        image: imagen
    });

    window.location.href = `/views/detalle.html?${params.toString()}`;
}