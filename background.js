let shlokas = [];
const SHLOKA_FILE_PATH = chrome.runtime.getURL("shlokas.txt");

async function readShlokasFromFile() {
    try {
        console.log(`Fetching shlokas from: ${SHLOKA_FILE_PATH}`);
        const response = await fetch(SHLOKA_FILE_PATH);

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const text = await response.text();
        shlokas = text
            .split("\n")
            .filter((line) => line.trim() !== ""); // Remove empty lines
        console.log("Shlokas loaded:", shlokas);
    } catch (error) {
        console.error("Error reading shlokas from file:", error);
    }
}

// Function to get a random shloka
function getRandomShloka() {
    if (shlokas.length === 0) {
        return "No shlokas available. Please check the file.";
    }
    const randomIndex = Math.floor(Math.random() * shlokas.length);
    return shlokas[randomIndex];
}

// Periodically refresh the shlokas (every 10 days)
setInterval(() => {
    console.log("Refreshing shlokas...");
    readShlokasFromFile();
}, 10 * 24 * 60 * 60 * 1000); // 10 days in milliseconds

// Load shlokas immediately when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Loading shlokas...");
    readShlokasFromFile();
});

// Listen for requests from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getShloka") {
        const shloka = getRandomShloka();
        console.log("Sending random shloka:", shloka);
        sendResponse({ shloka });
    }
});
