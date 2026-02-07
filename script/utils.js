const Utils = {
    configurarMenuHamburguesa() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navbar = document.querySelector('.navbar');
        const body = document.body;

        if (!mobileMenu || !navbar) return;

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
    },

    mostrarNotificacion(mensaje, tipo = 'info') {
        const antigua = document.querySelector('.notificacion');
        if (antigua) antigua.remove();

        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.textContent = mensaje;

        if (!document.querySelector('style#notificacion-style')) {
            const style = document.createElement('style');
            style.id = 'notificacion-style';
            style.textContent = `
                .notificacion {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 2000;
                    animation: slideIn 0.3s ease-out;
                    font-weight: bold;
                }
                .notificacion.error { background-color: #ff4757; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    },

    formatearPrecio(precio) {
        return Number(precio).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Utils.configurarMenuHamburguesa();
});
