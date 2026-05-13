const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
  },
});

const MODEL = "ministral-3:3b";

/**
 * Generates a concise 2-sentence summary of the given text using Ollama Cloud.
 * Returns a fallback string if summarization fails.
 */
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

async function generateSummary(text) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `Summarize this AI news article in 2 concise sentences:\n\n${text}`,
          },
        ],
      });

      return response.message.content;
    } catch (err) {
      const isRateLimit = err.status === 429 || err.message?.includes("rate limit");
      if (isRateLimit && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(`[Summarizer] Rate limited, retrying in ${delay / 1000}s (attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error(`[Summarizer] Failed (attempt ${attempt}):`, err.message);
      return "Summary unavailable.";
    }
  }
  return "Summary unavailable.";
}

module.exports = { generateSummary };
