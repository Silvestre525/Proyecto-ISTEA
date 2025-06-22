class CarritoCompras {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.total = 0;
        this.actualizarTotal();
    }


    agregarProducto(producto) {
        const productoExistente = this.carrito.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }

        this.guardarCarrito();
        this.actualizarTotal();
        this.mostrarNotificacion('Producto agregado al carrito');
    }

   
    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarTotal();
        this.mostrarNotificacion('Producto eliminado del carrito');
    }

    
    actualizarCantidad(id, cantidad) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.cantidad = cantidad;
            if (producto.cantidad <= 0) {
                this.eliminarProducto(id);
            }
        }
        this.guardarCarrito();
        this.actualizarTotal();
    }

   
    actualizarTotal() {
        this.total = this.carrito.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
        this.actualizarContadorCarrito();
    }

  
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        sessionStorage.setItem('ultimaActualizacion', new Date().toISOString());
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
        this.mostrarNotificacion('Carrito vaciado');
    }

    
    actualizarContadorCarrito() {
        const contador = document.querySelector('.cart-count');
        const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        
        if (contador) {
            contador.textContent = totalItems || '';
        }
    }

    
    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.carrito = new CarritoCompras();
    
    
    const botonesCompra = document.querySelectorAll('.buy-button');
    botonesCompra.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const producto = e.target.closest('.product-item');
            if (producto) {
                const productoData = {
                    id: producto.dataset.id || Math.random().toString(36).substr(2, 9),
                    nombre: producto.querySelector('.product-item__title h3').textContent,
                    precio: parseFloat(producto.querySelector('.info-price').textContent.replace('$', '').replace('.', '')),
                    imagen: producto.querySelector('.product-item__img img').src
                };
                window.carrito.agregarProducto(productoData);
            }
        });
    });
}); 