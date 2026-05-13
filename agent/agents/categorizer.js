const CATEGORIES = {
  "AI Models": [
    "gpt", "llm", "model", "llama", "gemini", "claude", "mistral", "deepseek",
    "qwen", "phi", "training", "fine-tune", "benchmark", "parameter", "token",
    "transformer", "diffusion", "multimodal", "vision model", "language model",
    "foundation model", "open-source model", "release", "launch",
  ],
  "Business": [
    "revenue", "stock", "market", "invest", "funding", "ipo", "acquisition",
    "startup", "enterprise", "billion", "million", "valuation", "profit",
    "earnings", "ceo", "company", "deal", "partnership", "contract", "hire",
    "layoff", "fired", "workforce", "employee",
  ],
  "Policy & Regulation": [
    "regulation", "policy", "government", "law", "ban", "restrict", "senate",
    "congress", "eu", "legislation", "compliance", "safety", "audit",
    "executive order", "copyright", "lawsuit", "legal", "court", "ruling",
  ],
  "Research": [
    "research", "paper", "study", "scientist", "university", "academic",
    "breakthrough", "discovery", "experiment", "arxiv", "mit", "stanford",
    "phd", "lab", "peer-review",
  ],
  "Ethics & Safety": [
    "ethics", "bias", "fairness", "deepfake", "misinformation", "privacy",
    "surveillance", "harmful", "alignment", "existential", "risk", "safety",
    "responsible", "transparent", "accountability",
  ],
  "Products & Tools": [
    "app", "tool", "platform", "feature", "update", "api", "plugin",
    "integration", "chatbot", "assistant", "copilot", "agent", "automation",
    "workflow", "saas", "product",
  ],
};

/**
 * Categorizes an article based on its title and summary using keyword matching.
 * Returns the best matching category or "General" if no match.
 */
function categorize(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  let bestCategory = "General";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

module.exports = { categorize };
