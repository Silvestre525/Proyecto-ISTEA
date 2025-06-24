const API_TOKEN = 'patwoVw3hjJjcX59Y.e9034fb6bcb1a67705ec0d72668c0cf4c404c9f96298439d22c807c077ef3468';
const BASE_ID = 'app8grixPLzalw8ra';
const TABLE_NAME = 'TableProducts';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const productosContainer = document.getElementById('productos');
let todosLosProductos = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarBuscador();
    actualizarContadorCarrito();
    configurarEventosIndex();
});

function configurarBuscador() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchInput.addEventListener('input', function() {
        filtrarProductos(this.value);
    });
    
    searchButton.addEventListener('click', function() {
        filtrarProductos(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
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

async function obtenerProductos() {
    try {
        const response = await fetch(AIRTABLE_URL, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        
        const data = await response.json();
        return data.records || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function cargarProductos() {
    try {
        const productos = await obtenerProductos();
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
        const productoHTML = `
            <article class="product-item" onclick="irADetalle('${producto.id}', '${producto.fields.name || ''}', ${producto.fields.price || 0}, '${producto.fields.image || ''}')">
                <figure class="product-item__img">
                    <img src="${producto.fields.image || '/img/Defecto.webp'}" 
                         alt="${producto.fields.name || 'Producto'}"
                         onerror="this.src='/img/Defecto.webp';">
                </figure>
                <div class="product-item__info">
                    <i class="fa-solid fa-truck"></i>
                    <p class="info-price">$${(producto.fields.price || 0).toFixed(2)}</p>
                    <p class="info-discount">20% OFF</p>
                </div>
                <div class="product-item__title">
                    <h3>${producto.fields.name || 'Sin nombre'}</h3>
                </div>
                <div class="product-item__button">
                    <button class="buy-button" onclick="event.stopPropagation(); agregarAlCarrito('${producto.id}', '${producto.fields.name || ''}', ${producto.fields.price || 0}, '${producto.fields.image || ''}')">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
        
        productosContainer.innerHTML += productoHTML;
    });
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

function mostrarProductosVacios() {
    productosContainer.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #666;">
            <h3>No hay productos disponibles</h3>
            <p>Pronto tendremos nuevos productos para ti</p>
        </div>
    `;
}

function agregarAlCarrito(id, nombre, precio, imagen) {
    const producto = {
        id: id,
        name: nombre,
        price: precio,
        image: imagen,
        quantity: 1
    };
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.quantity += 1;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    mostrarNotificacion('Producto agregado al carrito');
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function configurarEventosIndex() {
    console.log('Eventos del index configurados');
}

//Menu hamburger
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        navbar.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    mobileMenu.addEventListener('click', toggleMenu);

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            toggleMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
});