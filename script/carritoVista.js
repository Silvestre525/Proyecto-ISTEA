document.addEventListener('DOMContentLoaded', function() {
    mostrarCarrito();
    document.getElementById('clear-cart').addEventListener('click', vaciarCarrito);
    document.getElementById('checkout-button').addEventListener('click', () => {
        alert('¡Gracias por tu compra! (Simulación)');
        vaciarCarrito();
    });
    actualizarContadorCarrito();
});

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-cart-shopping"></i><p>Tu carrito está vacío</p></div>`;
        document.getElementById('subtotal').textContent = '$0';
        document.getElementById('total').textContent = '$0';
        return;
    }

    let subtotal = 0;
    carrito.forEach((producto, idx) => {
        subtotal += producto.price * producto.quantity;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <div class="cart-item__img">
                <img src="${producto.image || '/img/Defecto.webp'}" alt="${producto.name || 'Producto'}" onerror="this.src='/img/Defecto.webp';">
            </div>
            <div class="cart-item__details">
                <h3>${producto.name || 'Sin nombre'}</h3>
                <p class="cart-item__price">$${producto.price.toFixed(2)}</p>
                <div class="cart-item__quantity">
                    <label>Cantidad:</label>
                    <input type="number" min="1" value="${producto.quantity}" data-idx="${idx}" class="input-cantidad">
                </div>
                <button class="remove-button" data-idx="${idx}">Eliminar</button>
            </div>
        `;
        cartItems.appendChild(item);
    });

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;

    // Eventos para eliminar y cambiar cantidad
    document.querySelectorAll('.remove-button').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarProductoCarrito(parseInt(this.dataset.idx));
        });
    });
    document.querySelectorAll('.input-cantidad').forEach(input => {
        input.addEventListener('change', function() {
            cambiarCantidad(parseInt(this.dataset.idx), parseInt(this.value));
        });
    });
}

function eliminarProductoCarrito(idx) {
    let carrito = obtenerCarrito();
    carrito.splice(idx, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
}

function cambiarCantidad(idx, nuevaCantidad) {
    let carrito = obtenerCarrito();
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    carrito[idx].quantity = nuevaCantidad;
    guardarCarrito(carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
} 