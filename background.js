let shlokas = [];
let currentIndex = 0;

const SHLOKA_FILE_PATH = chrome.runtime.getURL("shlokas.txt");

async function readShlokasFromFile() {
    try {
        console.log(`Fetching shlokas from: ${SHLOKA_FILE_PATH}`);
        const response = await fetch(SHLOKA_FILE_PATH);

        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

        const text = await response.text();
        shlokas = text.split("\n").filter((line) => line.trim() !== "");

        if (shlokas.length === 0) {
            console.warn("No valid shlokas found in the file.");
            shlokas = ["No shlokas available. Please check the file."];
        }

        console.log("Shlokas updated:", shlokas);
    } catch (error) {
        console.error("Error reading shlokas from file:", error);
        shlokas = ["No shlokas available. Please check the file."];
    }
}

function getNextShloka() {
    if (shlokas.length === 0) {
        return "No shlokas available. Please check the file.";
    }
    const shloka = shlokas[currentIndex];
    currentIndex = (currentIndex + 1) % shlokas.length;
    return shloka;
}

// Refresh shlokas every 10 days
setInterval(() => {
    console.log("Refreshing shlokas...");
    readShlokasFromFile();
}, 10 * 24 * 60 * 60 * 1000);

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Loading shlokas...");
    readShlokasFromFile();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);

    if (message.action === "getShloka") {
        const shloka = getNextShloka();
        console.log("Sending shloka:", shloka);
        sendResponse({ shloka });
    } else if (message.action === "refreshShlokas") {
        readShlokasFromFile().then(() => {
            sendResponse({ status: "Shlokas refreshed" });
        });
        return true;
    }
});
