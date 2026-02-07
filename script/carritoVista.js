document.addEventListener('DOMContentLoaded', function () {
    if (!window.carrito) {
        window.carrito = new CarritoCompras();
    }

    mostrarCarrito();

    document.getElementById('clear-cart')?.addEventListener('click', () => {
        window.carrito.limpiarCarrito();
        mostrarCarrito();
    });

    document.getElementById('checkout-button')?.addEventListener('click', () => {
        alert('¡Gracias por tu compra! (Simulación)');
        window.carrito.limpiarCarrito();
        mostrarCarrito();
    });
});

function mostrarCarrito() {
    const carrito = window.carrito.obtenerCarrito();
    const cartItems = document.getElementById('cart-items');

    if (!cartItems) return;

    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-cart-shopping"></i><p>Tu carrito está vacío</p></div>`;
        actualizarTotalesVista(0);
        return;
    }

    carrito.forEach((producto) => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        const precioFormateado = Utils.formatearPrecio(producto.price);

        item.innerHTML = `
            <div class="cart-item__img">
                <img src="${producto.image || '/img/Defecto.webp'}" alt="${producto.name || 'Producto'}" onerror="this.src='/img/Defecto.webp';">
            </div>
            <div class="cart-item__details">
                <h3>${producto.name || 'Sin nombre'}</h3>
                <p class="cart-item__price">${precioFormateado}</p>
                <div class="cart-item__quantity">
                    <label>Cantidad:</label>
                    <input type="number" min="1" value="${producto.quantity}" data-id="${producto.id}" class="input-cantidad">
                </div>
                <button class="remove-button" data-id="${producto.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
            </div>
        `;
        cartItems.appendChild(item);
    });

    actualizarTotalesVista(window.carrito.obtenerTotal());

    document.querySelectorAll('.remove-button').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            window.carrito.eliminarProducto(id);
            mostrarCarrito();
        });
    });

    document.querySelectorAll('.input-cantidad').forEach(input => {
        input.addEventListener('change', function () {
            const id = this.getAttribute('data-id');
            const nuevaCantidad = parseInt(this.value);
            window.carrito.actualizarCantidad(id, nuevaCantidad);
            mostrarCarrito();
        });
    });
}

function actualizarTotalesVista(total) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = Utils.formatearPrecio(total);
    if (totalEl) totalEl.textContent = Utils.formatearPrecio(total);
}