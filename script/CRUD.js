const API_TOKEN = 'patwoVw3hjJjcX59Y.e9034fb6bcb1a67705ec0d72668c0cf4c404c9f96298439d22c807c077ef3468';
const BASE_ID = 'app8grixPLzalw8ra';
const TABLE_NAME = 'TableProducts';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const form = document.getElementById('form-producto');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const imagen = document.getElementById('imagen').value;

  if (!nombre || !precio || !imagen) {
    mensaje.textContent = 'Todos los campos son obligatorios.';
    mensaje.style.color = 'red';
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
    const response = await fetch(AIRTABLE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.textContent = 'Producto agregado con éxito ';
      mensaje.style.color = 'green';
      form.reset();
      console.log('Producto creado:', data);
    } else {
      console.error(data);
      mensaje.textContent = 'Error al agregar producto: ' + data.error.message;
      mensaje.style.color = 'red';
    }
  } catch (error) {
    console.error('Error:', error);
    mensaje.textContent = 'Error al conectar con Airtable.';
    mensaje.style.color = 'red';
  }
});
