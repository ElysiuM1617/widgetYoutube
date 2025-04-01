let API_KEY = "";

// Función para cargar la API Key
async function loadApiKey() {
    try {
        const response = await fetch("config.php");
        const data = await response.json();
        API_KEY = data.apiKey;
        // Habilitar el botón y restaurar el texto una vez que la API Key se haya cargado
        generateBtn.disabled = false;
        generateBtn.innerText = "Generar Widget"; // Cambia el texto del botón
    } catch (error) {
        console.error("Error al obtener la API Key:", error);
    }
}

// Mostrar mensaje de carga en el botón
const generateBtn = document.getElementById("generateWidget");
generateBtn.innerText = "Cargando..."; // Mensaje de carga
generateBtn.disabled = true; // Deshabilitar el botón mientras se carga la API Key

loadApiKey(); // Cargar la API Key al inicio

const widgetType = document.getElementById("widgetType");
const youtubeUrl = document.getElementById("youtubeUrl");
const widgetContainer = document.getElementById("widgetContainer");

const modalVideo = document.getElementById("modalVideo");

async function extractId(url) {
    let match = url.match(/youtube\.com\/channel\/([\w-]+)/);
    if (match) return { type: "channel", id: match[1] };

    match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return { type: "video", id: match[1] };

    match = url.match(/youtube\.com\/(?:@|user\/)([\w-]+)/);
    if (match) {
        const username = match[1];
        return { type: "channel", id: await getChannelIdByUsername(username) };
    }
    return null;
}

async function getChannelIdByUsername(username) {
    if (!API_KEY) return null;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=id&type=channel&q=${username}&key=${API_KEY}`);
    const data = await response.json();
    return data.items?.[0]?.id?.channelId || null;
}

async function fetchChannelData(channelId) {
    if (!API_KEY) return null;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`);
    const data = await response.json();
    return data.items?.[0] || null;
}

async function fetchVideoData(videoId) {
    if (!API_KEY) return null;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`);
    const data = await response.json();
    return data.items?.[0] || null;
}

async function fetchChannelVideos(channelId, maxResults) {
    if (!API_KEY) return [];

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`);
    const data = await response.json();
    return data.items || [];
}

// Función para abrir el modal con el video correcto
function openModal(videoId) {
    modalVideo.innerHTML = ` 
        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        <p class="mt-3"><strong>Código embebido:</strong></p>
        <textarea class="form-control" rows="3" readonly><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe></textarea>
    `;

    const modal = new bootstrap.Modal(document.getElementById("videoModal"));
    modal.show();

    // Evento para limpiar el iframe cuando se cierre el modal
    document.getElementById("videoModal").addEventListener("hidden.bs.modal", () => {
        modalVideo.innerHTML = ""; // Limpiar el contenido del modal
    });
}

// Función para generar el widget
async function generateWidget() {
    if (!API_KEY) {
        alert("La API Key aún no se ha cargado. Intenta de nuevo.");
        return;
    }

    const url = youtubeUrl.value.trim();
    if (!url) {
        alert("Ingresa una URL de YouTube válida.");
        return;
    }

    const extracted = await extractId(url);
    if (!extracted || !extracted.id) {
        alert("URL no válida.");
        return;
    }

    const { type, id } = extracted;

    if (widgetType.value === "video" && type === "video") {
        const videoData = await fetchVideoData(id);
        if (!videoData) {
            alert("No se pudo obtener información del video.");
            return;
        }

        const { snippet } = videoData;
        widgetContainer.innerHTML = `
            <div class='card' style='width: 560px; cursor: pointer;' data-video-id="${id}">
                <img src='${snippet.thumbnails.medium.url}' class='card-img-top'>
                <div class='card-body p-2'>
                    <h6 class='card-title' style='font-size: 16px;'>${snippet.title}</h6>
                </div>
            </div>
        `;
    } else if (type === "channel") {
        if (widgetType.value !== "grid") {
            const channelData = await fetchChannelData(id);
            if (!channelData) {
                alert("No se pudo obtener información del canal.");
                return;
            }

            const { snippet, statistics, brandingSettings } = channelData;
            const bannerUrl = brandingSettings?.image?.bannerExternalUrl || "";

            widgetContainer.innerHTML = `
                <div class="card p-3">
                    <img src="${bannerUrl}" class="card-img-top" style="height: 120px; object-fit: cover;">
                    <div class="d-flex align-items-center mt-2">
                        <img src="${snippet.thumbnails.high.url}" class="rounded-circle me-2" width="50">
                        <div>
                            <h5 class="mb-0">${snippet.title}</h5>
                            <small class="text-muted">${statistics.subscriberCount} suscriptores</small>
                        </div>
                    </div>
                </div>
            `;
        }

        const videoCount = widgetType.value === "grid" ? 9 : 3;
        const videos = await fetchChannelVideos(id, videoCount);

        const validVideos = videos.filter(video => video.id.videoId).slice(0, videoCount);

        let videosHtml = validVideos.length > 0 ? validVideos.map(video => `
            <div class="col-md-4 mb-3">
                <div class="card video-card" data-video-id="${video.id.videoId}">
                    <img src="${video.snippet.thumbnails.medium.url}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${video.snippet.title}</h6>
                    </div>
                </div>
            </div>
        `).join("") : `<p class="text-muted">Este canal no tiene videos públicos.</p>`;

        if (widgetType.value === "grid") {
            widgetContainer.innerHTML = `<div class="row mt-3">${videosHtml}</div>`;
        } else {
            widgetContainer.innerHTML += `<div class="row mt-3">${videosHtml}</div>`;
        }

        // Escuchar clics en los videos
        document.querySelectorAll(".video-card").forEach(card => {
            card.addEventListener("click", function () {
                const videoId = this.getAttribute("data-video-id");
                openModal(videoId);  // Abre el video en el modal
            });
        });
    } else {
        alert("El tipo de URL no coincide con el widget seleccionado.");
    }
}

// Cargar la API Key al inicio
loadApiKey();

// Evento para generar el widget
generateBtn.addEventListener("click", async () => {
    await generateWidget();
});

