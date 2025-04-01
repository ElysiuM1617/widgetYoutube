# YouTube Widget Generator

Este proyecto permite generar widgets personalizados de YouTube para videos, canales y grillas de videos mediante la API de YouTube.

## Características
- **Widget de Video**: Muestra información de un video de YouTube y permite reproducirlo en un modal.
- **Widget de Canal**: Obtiene detalles de un canal de YouTube, incluyendo su imagen de perfil y banner.
- **Widget de Grilla de Videos**: Genera una lista de videos recientes de un canal en un diseño de grilla.

## Tecnologías Utilizadas
- HTML, CSS, JavaScript
- Bootstrap 5
- API de YouTube Data v3

## 📂 Estructura del Proyecto
```
📁 widgetYoutube
│-- 📄 index.html  # Interfaz principal
│-- 📄 styles.css  # Estilos personalizados
│-- 📄 script.js   # Lógica del widget
│-- 📄 config.php  # Archivo para cargar la API Key
```

## Instalación
### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/tuusuario/proyecto-youtube-widget.git
cd proyecto-youtube-widget
```

### 2️⃣ Configura la API Key de YouTube
1. Crea un archivo `config.php` con el siguiente contenido:
   ```php
   <?php
   header('Content-Type: application/json');
   echo json_encode(['apiKey' => 'TU_API_KEY']);
   ?>
   ```
2. Reemplaza `'TU_API_KEY'` con tu clave de la API de YouTube.

### 3️⃣ Ejecuta el Proyecto
Solo abre `index.html` en tu navegador. Si usas un servidor local, puedes iniciar un servidor simple:
```bash
php -S localhost:8000
```
Luego accede a `http://localhost:8000` en tu navegador.

## Uso
  1. Entra a la página: http://elysium2017.wuaze.com
  2. Selecciona el tipo de widget.
  3. Ingresa una url válida.
  4. Haz clic en **generar widget**.
  4. Se mostrarán el tipo widget seleccionado.

### 🔹 Reproducción de Video en Modal
Al hacer clic en un video, se abrirá un modal con el video embebido y su código de inserción.
