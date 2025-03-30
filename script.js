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

    return null;
}

