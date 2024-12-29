const API_URL = "https://api.openai.com/v1/completions";
const API_KEY = CONFIG.OPENAI_API_KEY;

document.addEventListener("DOMContentLoaded", async () => {
    const shlokaText = document.getElementById("shloka-text");
    const shlokaVerse = document.getElementById("shloka-verse");

    // Define the chapters and corresponding number of verses
    const chapters = {
        2: 72, // Chapter 2: 72 verses
        3: 43, // Chapter 3: 43 verses
        4: 42, // Chapter 4: 42 verses
        5: 29, // Chapter 5: 29 verses
        6: 47, // Chapter 6: 47 verses
    };

    // Function to randomly select a chapter and verse
    function getRandomShloka() {
        const chapterNumbers = Object.keys(chapters);
        const randomChapter = chapterNumbers[Math.floor(Math.random() * chapterNumbers.length)];
        const randomVerse = Math.floor(Math.random() * chapters[randomChapter]) + 1;
        return { chapter: randomChapter, verse: randomVerse };
    }

    // Function to fetch a shloka using OpenAI
    async function fetchShloka() {
        const { chapter, verse } = getRandomShloka();

        const prompt = `Provide the Bhagavad Gita shloka from Chapter ${chapter}, Verse ${verse}, including the Devanagari text and its English meaning.`;

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
                    max_tokens: 200,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();

            if (data && data.choices && data.choices[0]) {
                const shlokaTextContent = data.choices[0].text.trim();
                shlokaText.textContent = shlokaTextContent;
                shlokaVerse.textContent = `Chapter ${chapter}, Verse ${verse}`;
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
