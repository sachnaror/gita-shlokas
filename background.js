let shlokas = [];
const SHLOKA_FILE_PATH = chrome.runtime.getURL("shlokas.txt");

// Default fallback shlokas (in case file is missing or unreadable)
const DEFAULT_SHLOKAS = [
    "Your right is to perform your duty, but not to the fruits of your actions.",
    "A person who abandons all desires and lives free of longing attains peace.",
    "The mind is restless and difficult to control, but it can be conquered with practice and detachment.",
    "The one who sees inaction in action and action in inaction is truly wise.",
    "The self-realized soul sees everything equally, whether it is a Brahmin, an elephant, or a dog.",
    "Whenever righteousness declines, I manifest Myself to restore dharma.",
    "One who acts without being attached to the results achieves supreme peace.",
    "Through devotion, one can know Me as the Supreme Reality.",
    "The yogi who is satisfied with the self alone is truly established in wisdom.",
    "Better to do one's own duty imperfectly than to do another's duty perfectly."
];

// Function to read shlokas from the file
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
            .map((line) => line.trim())
            .filter((line) => line.length > 0); // Remove empty lines

        if (shlokas.length === 0) {
            console.warn("File loaded, but no valid shlokas found. Using default shlokas.");
            shlokas = [...DEFAULT_SHLOKAS];
        } else {
            console.log(`Shlokas loaded successfully (${shlokas.length} shlokas).`);
        }
    } catch (error) {
        console.error("Error reading shlokas from file. Falling back to default shlokas:", error);
        shlokas = [...DEFAULT_SHLOKAS];
    }
}

// Function to get a random shloka
function getRandomShloka() {
    if (shlokas.length === 0) {
        console.warn("Shlokas array is empty. Falling back to default shlokas.");
        shlokas = [...DEFAULT_SHLOKAS];
    }
    const randomIndex = Math.floor(Math.random() * shlokas.length);
    return shlokas[randomIndex];
}

// Initial shloka loading
function initializeShlokas() {
    console.log("Initializing shlokas...");
    readShlokasFromFile();
    setInterval(() => {
        console.log("Refreshing shlokas from file...");
        readShlokasFromFile();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

// Read shlokas immediately when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Loading shlokas...");
    initializeShlokas();
});

// Reload shlokas when the browser starts
chrome.runtime.onStartup.addListener(() => {
    console.log("Browser started. Reloading shlokas...");
    initializeShlokas();
});

// Listen for requests from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getShloka") {
        const shloka = getRandomShloka();
        console.log("Sending shloka:", shloka);
        sendResponse({ shloka });
    }
});
