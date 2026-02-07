document.addEventListener('DOMContentLoaded', function () {
    cargarDetallesProducto();
    configurarBotonCarrito();
});

function cargarDetallesProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');

    const productImageElement = document.getElementById('product-image');
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');
    const productDescriptionElement = document.getElementById('product-description');

    if (productImageElement && productImage) {
        productImageElement.src = productImage;
        productImageElement.alt = productName || 'Producto';
    }

    if (productNameElement && productName) {
        productNameElement.textContent = productName;
        document.title = `${productName} - Tienda de Ropa`;
    }

    if (productPriceElement && productPrice) {
        const precioFormateado = Utils.formatearPrecio(productPrice);
        productPriceElement.textContent = precioFormateado;
    }

    if (productDescriptionElement) {
        productDescriptionElement.textContent = `Descripción detallada de ${productName || 'este producto'}. Este artículo cuenta con un diseño cómodo y elegante, ideal para el día a día.`;
    }

    window.currentProduct = {
        id: productId,
        name: productName,
        price: parseFloat(productPrice) || 0,
        image: productImage
    };
}

function configurarBotonCarrito() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const quantityInput = document.getElementById('quantity');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            if (!sizeSelect.value || !colorSelect.value) {
                alert('Por favor selecciona una talla y un color');
                return;
            }

            const quantity = parseInt(quantityInput.value) || 1;
            agregarAlCarritoDesdeDetalle(quantity);
        });
    }
}

function agregarAlCarritoDesdeDetalle(quantity) {
    if (!window.currentProduct) {
        alert('Error: No se pudo obtener la información del producto');
        return;
    }

    if (!window.carrito) {
        console.error('Carrito no inicializado');
        return;
    }

    window.carrito.agregarProducto({
        id: window.currentProduct.id,
        name: window.currentProduct.name,
        price: window.currentProduct.price,
        image: window.currentProduct.image,
        quantity: quantity
    });
}
