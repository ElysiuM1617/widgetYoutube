let API_KEY = "";

async function loadApiKey() {
    try {
        const response = await fetch("config.php");
        const data = await response.json();
        API_KEY = data.apiKey;
    } catch (error) {
        console.error("Error al obtener la API Key:", error);
    }
}

// Cargar la API Key antes de ejecutar cualquier otra función
loadApiKey();

const widgetType = document.getElementById("widgetType");
const youtubeUrl = document.getElementById("youtubeUrl");
const generateBtn = document.getElementById("generateWidget");
const widgetContainer = document.getElementById("widgetContainer");

generateBtn.addEventListener("click", () => {
    console.log("Generar widget presionado");
});

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

function openModal(videoId) {
    modalVideo.innerHTML = `
        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        <p class="mt-3"><strong>Código embebido:</strong></p>
        <textarea class="form-control" rows="3" readonly><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></textarea>
    `;
    new bootstrap.Modal(document.getElementById("videoModal")).show();
}




