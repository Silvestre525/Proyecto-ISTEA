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