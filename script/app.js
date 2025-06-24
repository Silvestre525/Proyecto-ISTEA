

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        navbar.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    mobileMenu.addEventListener('click', toggleMenu);

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            toggleMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Lógica para la vista productosCRUD.html
if (window.location.pathname.includes('productosCRUD.html')) {
    const form = document.getElementById('producto-form');
    const tabla = document.getElementById('productos-table').querySelector('tbody');
    const cancelarBtn = document.getElementById('cancelar-edicion');
    let editandoId = null;

    async function renderProductos() {
        const productos = await obtenerProductos();
        tabla.innerHTML = '';
        productos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td><img src="${p.imagen}" alt="img" width="50"></td>
                <td>
                    <button class="editar" data-id="${p.id}">Editar</button>
                    <button class="eliminar" data-id="${p.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const producto = {
            nombre: document.getElementById('nombre').value,
            precio: Number(document.getElementById('precio').value),
            imagen: document.getElementById('imagen').value
        };
        if (editandoId) {
            await editarProducto(editandoId, producto);
        } else {
            await agregarProducto(producto);
        }
        form.reset();
        editandoId = null;
        cancelarBtn.style.display = 'none';
        await renderProductos();
    });

    tabla.addEventListener('click', async (e) => {
        if (e.target.classList.contains('eliminar')) {
            await eliminarProducto(e.target.dataset.id);
            await renderProductos();
        } else if (e.target.classList.contains('editar')) {
            const productos = await obtenerProductos();
            const prod = productos.find(p => p.id === e.target.dataset.id);
            document.getElementById('nombre').value = prod.nombre;
            document.getElementById('precio').value = prod.precio;
            document.getElementById('imagen').value = prod.imagen;
            editandoId = prod.id;
            cancelarBtn.style.display = 'inline';
        }
    });

    cancelarBtn.addEventListener('click', () => {
        form.reset();
        editandoId = null;
        cancelarBtn.style.display = 'none';
    });

    renderProductos();
}