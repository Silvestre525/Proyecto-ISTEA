const API_TOKEN = 'patwoVw3hjJjcX59Y.e9034fb6bcb1a67705ec0d72668c0cf4c404c9f96298439d22c807c077ef3468';
const BASE_ID = 'app8grixPLzalw8ra';
const TABLE_NAME = 'TableProducts';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const form = document.getElementById('form-producto');
const mensaje = document.getElementById('mensaje');
const productosTbody = document.getElementById('productos-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelarBtn = document.getElementById('cancelar-edicion');

let editandoId = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    
    form.addEventListener('submit', guardarProducto);
    
    cancelarBtn.addEventListener('click', cancelarEdicion);
});

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
            await actualizarProducto(editandoId, producto);
            mostrarMensaje('Producto actualizado con éxito', 'success');
        } else {
            await crearProducto(producto);
            mostrarMensaje('Producto agregado con éxito', 'success');
        }
        
        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error');
    }
}

async function crearProducto(producto) {
    const response = await fetch(AIRTABLE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });
    
    if (!response.ok) {
        throw new Error('Error al crear producto');
    }
    
    return await response.json();
}
async function obtenerProductos() {
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
}
async function actualizarProducto(id, producto) {
    const response = await fetch(`${AIRTABLE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });
    
    if (!response.ok) {
        throw new Error('Error al actualizar producto');
    }
    
    return await response.json();
}

async function eliminarProducto(id) {
    const response = await fetch(`${AIRTABLE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Error al eliminar producto');
    }
    
    return true;
}
