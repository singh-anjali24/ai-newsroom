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
async function generateSummary(text) {
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
    console.error("[Summarizer] Failed:", err.message);
    return "Summary unavailable.";
  }
}

module.exports = { generateSummary };
