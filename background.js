const API_URL = "https://api.openai.com/v1/completions";
const API_KEY = "your_openai_api_key_here"; // Replace with your OpenAI API key

document.addEventListener("DOMContentLoaded", async () => {
    const shlokaText = document.getElementById("shloka-text");
    const shlokaVerse = document.getElementById("shloka-verse");

    // Function to fetch a shloka using OpenAI
    async function fetchShloka() {
        const totalVerses = 233;
        const verseNumber = Math.floor(Math.random() * totalVerses) + 1;

        const prompt = `Provide the Bhagavad Gita shloka number ${verseNumber}, including the Devanagari text and its English meaning.`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: prompt,
                    max_tokens: 150,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();

            if (data && data.choices && data.choices[0]) {
                const shlokaTextContent = data.choices[0].text.trim();
                shlokaText.textContent = shlokaTextContent;
                shlokaVerse.textContent = `Verse: ${verseNumber}`;
            } else {
                shlokaText.textContent = "Failed to fetch shloka.";
                shlokaVerse.textContent = "";
            }
        } catch (error) {
            console.error("Error fetching shloka:", error);
            shlokaText.textContent = "Error fetching shloka. Please try again.";
            shlokaVerse.textContent = "";
        }
    }

    // Fetch and display the shloka
    fetchShloka();
});
