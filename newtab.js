document.addEventListener("DOMContentLoaded", () => {
    const shlokaElement = document.getElementById("shloka");

    // Display cached shloka immediately
    chrome.storage.local.get("cachedShloka", (result) => {
        if (result.cachedShloka) {
            console.log("Loaded cached shloka:", result.cachedShloka);
            shlokaElement.textContent = result.cachedShloka;
        } else {
            console.log("No cached shloka found.");
            shlokaElement.textContent = "Loading shloka...";
        }
    });

    // Fetch a new shloka and update the cache
    chrome.runtime.sendMessage({ action: "getShloka" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message);
            return;
        }

        if (response && response.shloka) {
            console.log("Fetched new shloka:", response.shloka);
            shlokaElement.textContent = response.shloka;

            // Update the cache with the new shloka
            chrome.storage.local.set({ cachedShloka: response.shloka }, () => {
                console.log("New shloka cached successfully.");
            });
        } else {
            console.error("No shloka received or an error occurred.");
            shlokaElement.textContent = "Could not load shloka. Please try again later.";
        }
    });
});
