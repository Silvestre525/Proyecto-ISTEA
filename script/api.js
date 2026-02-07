const getHeaders = () => ({
    'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
    'Content-Type': 'application/json'
});

const API = {
    async obtenerProductos() {
        try {
            const response = await fetch(AIRTABLE_URL, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.API_TOKEN}`
                }
            });

            if (!response.ok) throw new Error('Error al obtener productos');

            const data = await response.json();
            return data.records || [];
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    async crearProducto(producto) {
        const response = await fetch(AIRTABLE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(producto)
        });

        if (!response.ok) throw new Error('Error al crear producto');
        return await response.json();
    },

    async actualizarProducto(id, producto) {
        const response = await fetch(`${AIRTABLE_URL}/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(producto)
        });

        if (!response.ok) throw new Error('Error al actualizar producto');
        return await response.json();
    },

    async eliminarProducto(id) {
        const response = await fetch(`${AIRTABLE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${CONFIG.API_TOKEN}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar producto');
        return true;
    }
};
