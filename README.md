# Proyecto ISTEA - Tienda de Ropa

Este es el proyecto final para ISTEA. Es una tienda de ropa simple que utiliza HTML, CSS, JavaScript y Airtable como base de datos.

## Configuración Inicial

Por razones de seguridad, las claves de API no se incluyen en el repositorio. Para ejecutar el proyecto localmente, debes crear un archivo de configuración.

1.  Navega a la carpeta `script/`.
2.  Crea un archivo llamado `config.js`.
3.  Pega el siguiente código dentro de `script/config.js` (reemplazando los valores con tus credenciales reales):

```javascript
const CONFIG = {
    API_TOKEN: 'TU_API_TOKEN_AQUI',
    BASE_ID: 'app8grixPLzalw8ra',
    TABLE_NAME: 'TableProducts'
};

const AIRTABLE_URL = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.TABLE_NAME}`;
```

> **Nota Importante:** El archivo `script/config.js` está ignorado por git para proteger tus claves. No lo elimines de `.gitignore`.

4.  Abre `index.html` en tu navegador.

## Estructura del Proyecto

-   `img/`: Imágenes de logos y productos.
-   `script/`: Lógica de la aplicación (Carrito, CRUD, etc.).
-   `styles/`: Archivos CSS.
-   `views/`: Páginas HTML adicionales (Carrito, CRUD).
