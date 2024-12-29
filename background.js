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
    "Better to do one's own duty imperfectly than to do another's duty perfectly.",
    "The person who does not follow the ordained cycle of the Vedas lives a sinful life, and their soul becomes worthless.",
    "It is better to perform one’s own duty, even imperfectly, than to perform another’s duty perfectly.",
    "Whenever righteousness declines and unrighteousness rises, I manifest Myself.",
    "The person who dedicates their actions to God and works without desires is untouched by sin, like water on a lotus leaf.",
    "A wise person sees a Brahmin, a cow, an elephant, a dog, and an outcast with equal vision.",
    "The one who desires no fruits of action is a true renunciate and a true yogi, not the one who simply abstains from rituals or actions.",
    "The one who uplifts themselves and does not degrade themselves is a friend to their soul. The soul is both a friend and an enemy.",
    "Just as many rivers enter the ocean but it remains calm and steady, so does a person free from desires attain peace.",
    "Your right is only to perform your duties, not to the fruits of your actions. Do not let the fruits of action motivate you, nor fall into inaction.",
    "Among yogis, the one who worships Me with full faith and remains absorbed in Me is most intimately united with Me and is the greatest.",
    "The one with a steady mind who rests in the unmanifest crosses over sorrow and is not attached to pleasures.",
    "The person who acts only out of duty, without attachment to the results, is a true renunciate.",
    "A wise person must be free from attachment, hatred, and fear while practicing self-restraint.",
    "The one who offers all their actions to Me and renounces the fruits of all work is devoted to Me.",
    "Renunciation and yoga both lead to liberation, but of the two, yoga is superior.",
    "A true yogi remains equal in pleasure and pain, gain and loss, success and failure.",
    "The one who works without attachment to the results attains the light of knowledge.",
    "The one who controls their senses becomes steady in their soul and experiences supreme bliss.",
    "No person can remain without action for even a moment.",
    "The one who dedicates all their actions to God in the spirit of a witness becomes free from bondage.",
    "The yogi who treats success and failure equally is a true yogi.",
    "The one who performs their duties without attachment attains purity.",
    "Nothing is purer than knowledge. This knowledge can be attained through yoga.",
    "The one who focuses their mind on Me and has complete faith in Me becomes united with Me.",
    "The one who conquers their senses experiences knowledge and inner joy.",
    "Without renunciation of actions, attaining self-knowledge is impossible.",
    "Through yoga, one can control their mind and attain stability.",
    "The one who follows a balanced diet and proper rest achieves success in yoga.",
    "The soul is indestructible, invincible, and unaffected by anything.",
    "A yogi should make their soul their friend, not their enemy.",
    "The person who sees all beings with equal vision is a true yogi.",
    "The one who sees God in everything and everything in God never becomes separated from God.",
    "The one who finds satisfaction and joy in their soul attains supreme peace.",
    "The one who loves Me and considers Me the dearest is a true devotee.",
    "A self-realized person renounces all fruits of actions and dedicates everything to God.",
    "The karma yogi who remains equal in success and failure attains spiritual perfection.",
    "The one who controls their senses becomes worthy of knowledge.",
    "Those trapped in delusion and ignorance cannot attain self-realization.",
    "The one who dedicates their work to God becomes free from worldly bondage.",
    "A person must uplift themselves and not let themselves fall into degradation.",
    "The ignorant person cannot distinguish between the body and the soul.",
    "The one who abandons all desires and remains content in the soul is a true yogi.",
    "The one who regards God as supreme becomes free from fear and anxiety.",
    "A self-realized person remains unattached to actions and their fruits.",
    "The one who renounces sensual pleasures experiences supreme bliss.",
    "A yogi must meditate with peace and focus.",
    "A true yogi works for the welfare of all beings.",
    "The one who follows truth and righteousness receives God’s grace.",
    "The one who works without attachment and desire attains liberation.",
    "The yogi who unites their soul with God attains steadiness and peace."
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
