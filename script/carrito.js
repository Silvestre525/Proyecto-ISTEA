class CarritoCompras {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.total = 0;
        this.actualizarTotal();
        this.actualizarContadorCarrito();
    }

    agregarProducto(producto) {
        const productoExistente = this.carrito.find(item => item.id === producto.id);

        if (productoExistente) {
            productoExistente.quantity += producto.quantity || 1;
        } else {
            this.carrito.push({
                id: producto.id,
                name: producto.name,
                price: producto.price,
                image: producto.image,
                quantity: producto.quantity || 1
            });
        }

        this.guardarCarrito();
        this.actualizarTotal();

        if (typeof Utils !== 'undefined' && Utils.mostrarNotificacion) {
            Utils.mostrarNotificacion('Producto agregado al carrito', 'success');
        }
    }

    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarTotal();
        if (typeof Utils !== 'undefined' && Utils.mostrarNotificacion) {
            Utils.mostrarNotificacion('Producto eliminado del carrito', 'info');
        }
    }

    actualizarCantidad(id, quantity) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.quantity = quantity;
            if (producto.quantity <= 0) {
                this.eliminarProducto(id);
            }
        }
        this.guardarCarrito();
        this.actualizarTotal();
    }

    actualizarTotal() {
        this.total = this.carrito.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        this.actualizarContadorCarrito();
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    obtenerCarrito() {
        return this.carrito;
    }

    obtenerTotal() {
        return this.total;
    }

    limpiarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarTotal();
        if (typeof Utils !== 'undefined' && Utils.mostrarNotificacion) {
            Utils.mostrarNotificacion('Carrito vaciado', 'info');
        }
    }

    actualizarContadorCarrito() {
        const contador = document.querySelector('.cart-count');
        const totalItems = this.carrito.reduce((total, item) => total + item.quantity, 0);

        if (contador) {
            contador.textContent = totalItems || '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.carrito) {
        window.carrito = new CarritoCompras();
    }

    const container = document.body;

    container.addEventListener('click', (e) => {
        if (e.target.closest('.buy-button')) {
            e.stopPropagation();
        }
    });
});