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


