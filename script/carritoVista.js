document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout-button');

    function formatearPrecio(precio) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(precio);
    }

    function renderizarCarrito() {
        const carrito = window.carrito.obtenerCarrito();
        cartItemsContainer.innerHTML = '';

        if (carrito.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="/views/index.html" class="continue-shopping">Continuar comprando</a>
                </div>
            `;
            return;
        }

        carrito.forEach(item => {
            const itemElement = document.createElement('article');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <figure class="cart-item__img">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </figure>
                <div class="cart-item__details">
                    <h3>${item.nombre}</h3>
                    <p class="cart-item__price">${formatearPrecio(item.precio)}</p>
                    <div class="cart-item__quantity">
                        <label for="quantity-${item.id}">Cantidad:</label>
                        <input type="number" 
                               id="quantity-${item.id}" 
                               value="${item.cantidad}" 
                               min="1"
                               data-id="${item.id}">
                    </div>
                    <button class="remove-button" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        const total = window.carrito.obtenerTotal();
        subtotalElement.textContent = formatearPrecio(total);
        totalElement.textContent = formatearPrecio(total);

        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.remove-button').dataset.id;
                window.carrito.eliminarProducto(id);
                renderizarCarrito();
            });
        });

        document.querySelectorAll('.cart-item__quantity input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const cantidad = parseInt(e.target.value);
                window.carrito.actualizarCantidad(id, cantidad);
                renderizarCarrito();
            });
        });
    }

    clearCartButton.addEventListener('click', () => {
        window.carrito.limpiarCarrito();
        renderizarCarrito();
    });

    checkoutButton.addEventListener('click', () => {
        if (window.carrito.obtenerCarrito().length === 0) {
            window.carrito.mostrarNotificacion('El carrito está vacío');
            return;
        }
        window.carrito.mostrarNotificacion('Procediendo al pago...');
    });

    renderizarCarrito();
}); 