const form = document.getElementById('form-producto');
const mensaje = document.getElementById('mensaje');
const productosTbody = document.getElementById('productos-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelarBtn = document.getElementById('cancelar-btn');

let editandoId = null;

document.addEventListener('DOMContentLoaded', function () {
    cargarProductos();

    form.addEventListener('submit', guardarProducto);
    cancelarBtn.addEventListener('click', cancelarEdicion);
});

async function cargarProductos() {
    try {
        const productos = await API.obtenerProductos();
        mostrarProductos(productos);
    } catch (error) {
        mostrarMensaje('Error al cargar productos: ' + error.message, 'error');
        mostrarProductos([]);
    }
}

async function guardarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').value;

    if (!nombre || !precio || !imagen) {
        mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    const producto = {
        fields: {
            name: nombre,
            price: precio,
            image: imagen
        }
    };

    try {
        if (editandoId) {
            await API.actualizarProducto(editandoId, producto);
            mostrarMensaje('Producto actualizado con éxito', 'success');
        } else {
            await API.crearProducto(producto);
            mostrarMensaje('Producto agregado con éxito', 'success');
        }

        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error');
    }
}

function mostrarProductos(productos) {
    productosTbody.innerHTML = '';

    if (productos.length === 0) {
        productosTbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    No hay productos. ¡Agrega el primero!
                </td>
            </tr>
        `;
        return;
    }

    productos.forEach(producto => {
        const row = document.createElement('tr');
        const precioFormateado = Utils.formatearPrecio(producto.fields.price);

        const pId = producto.id;
        const pName = (producto.fields.name || '').replace(/'/g, "\\'");
        const pPrice = producto.fields.price || 0;
        const pImg = (producto.fields.image || '').replace(/'/g, "\\'");

        row.innerHTML = `
            <td>
                <img src="${producto.fields.image || ''}" 
                     alt="${producto.fields.name || 'Producto'}" 
                     class="producto-imagen"
                     onerror="this.src='../img/Defecto.webp';">
            </td>
            <td>${producto.fields.name || 'Sin nombre'}</td>
            <td>${precioFormateado}</td>
            <td>
                <button onclick="editarProducto('${pId}', '${pName}', ${pPrice}, '${pImg}')" class="btn-editar">
                    Editar
                </button>
                <button onclick="eliminarProductoConfirmado('${pId}')" class="btn-eliminar">
                    Eliminar
                </button>
            </td>
        `;
        productosTbody.appendChild(row);
    });
}

function editarProducto(id, nombre, precio, imagen) {
    editandoId = id;

    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
    document.getElementById('imagen').value = imagen;

    formTitle.textContent = 'Editar Producto';
    submitBtn.textContent = 'Actualizar Producto';
    cancelarBtn.style.display = 'inline-block';
}

async function eliminarProductoConfirmado(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await API.eliminarProducto(id);
            mostrarMensaje('Producto eliminado con éxito', 'success');
            cargarProductos();
        } catch (error) {
            mostrarMensaje('Error al eliminar: ' + error.message, 'error');
        }
    }
}

function cancelarEdicion() {
    editandoId = null;
    limpiarFormulario();
}

function limpiarFormulario() {
    form.reset();
    editandoId = null;

    formTitle.textContent = 'Agregar Nuevo Producto';
    submitBtn.textContent = 'Guardar Producto';
    cancelarBtn.style.display = 'none';
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;

    setTimeout(() => {
        mensaje.textContent = '';
        mensaje.className = 'mensaje';
    }, 3000);
}
