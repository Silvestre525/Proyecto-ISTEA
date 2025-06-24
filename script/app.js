const API_TOKEN = 'patwoVw3hjJjcX59Y.e9034fb6bcb1a67705ec0d72668c0cf4c404c9f96298439d22c807c077ef3468';
const BASE_ID = 'app8grixPLzalw8ra';
const TABLE_NAME = 'TableProducts';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const productosContainer = document.getElementById('productos');







//Menu hamburger
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