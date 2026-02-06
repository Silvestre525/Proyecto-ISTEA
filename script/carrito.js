class CarritoCompras {
    constructor() {
        const rawCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.carrito = this.validarYMigrar(rawCarrito);
        this.guardarCarrito(); // Guardar la versión corregida inmediatamente
        this.total = 0;
        this.actualizarTotal();
    }

    validarYMigrar(items) {
        if (!Array.isArray(items)) return [];
        
        return items.map(item => {
            // Intenta obtener los valores en inglés, o usa los de español como fallback
            const migratedItem = {
                id: item.id || item._id || Date.now().toString(), // Fallback para ID si no existe
                name: item.name || item.nombre || 'Producto sin nombre',
                price: parseFloat(item.price !== undefined ? item.price : (item.precio !== undefined ? item.precio : 0)),
                image: item.image || item.imagen || '/img/Defecto.webp',
                quantity: parseInt(item.quantity !== undefined ? item.quantity : (item.cantidad !== undefined ? item.cantidad : 1))
            };

            return migratedItem;
        }).filter(item => {
            // Filtra productos inválidos (precio NaN o sin ID válido si fuera crítico)
            return item.id && !isNaN(item.price);
        });
    }


    agregarProducto(producto) {
        const productoExistente = this.carrito.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.quantity += 1;
        } else {
            this.carrito.push({
                id: producto.id,
                name: producto.name,
                price: producto.price,
                image: producto.image,
                quantity: 1
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
        const totalItems = this.carrito.reduce((total, item) => total + item.quantity, 0);
        
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
                    name: producto.querySelector('.product-item__title h3').textContent,
                    price: parseFloat(producto.querySelector('.info-price').textContent.replace('$', '').replace('.', '')),
                    image: producto.querySelector('.product-item__img img').src
                };
                window.carrito.agregarProducto(productoData);
            }
        });
    });
}); 