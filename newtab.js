// Function to display the shloka
function displayShloka() {
    const shlokaElement = document.getElementById("shloka");

    // Request the next shloka from the background script
    chrome.runtime.sendMessage({ action: "getShloka" }, (response) => {
        if (response && response.shloka) {
            console.log("Shloka received:", response.shloka);
            shlokaElement.textContent = response.shloka;
        } else {
            console.error("Failed to fetch shloka:", response);
            shlokaElement.textContent = "Could not load shloka. Please try again later.";
        }
    });
}

// Trigger the display function when the new tab loads
document.addEventListener("DOMContentLoaded", displayShloka);
