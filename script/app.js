const API_TOKEN = 'patwoVw3hjJjcX59Y.e9034fb6bcb1a67705ec0d72668c0cf4c404c9f96298439d22c807c077ef3468';
const BASE_ID = 'app8grixPLzalw8ra';
const TABLE_NAME = 'TableProducts';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const productosContainer = document.getElementById('productos');

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
});

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
    productosContainer.innerHTML = '';
    
    productos.forEach(producto => {
        const productoHTML = `
            <article class="product-item">
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
                    <button class="buy-button" onclick="agregarAlCarrito('${producto.id}', '${producto.fields.name || ''}', ${producto.fields.price || 0}, '${producto.fields.image || ''}')">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
        
        productosContainer.innerHTML += productoHTML;
    });
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