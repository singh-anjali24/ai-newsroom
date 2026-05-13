const Parser = require("rss-parser");

const parser = new Parser();

const RSS_FEEDS = [
  { url: "https://news.google.com/rss/search?q=AI", defaultSource: "Google News" },
  { url: "https://news.google.com/rss/search?q=artificial+intelligence+LLM", defaultSource: "Google News" },
  { url: "https://news.google.com/rss/search?q=OpenAI+OR+Anthropic+OR+Google+AI", defaultSource: "Google News" },
];

const ARTICLES_PER_FEED = 10;

/**
 * Fetches AI news from multiple RSS feeds and deduplicates by URL.
 * Returns up to ARTICLES_PER_FEED * feeds items with normalized fields.
 */
function extractSource(title, fallback) {
  const match = title?.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : fallback;
}

async function fetchArticles() {
  const seen = new Set();
  const articles = [];

  for (const { url, defaultSource } of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items.slice(0, ARTICLES_PER_FEED)) {
        if (seen.has(item.link)) continue;
        seen.add(item.link);
        const source = item.source?.title || extractSource(item.title, defaultSource);
        articles.push({
          title: item.title,
          content: item.contentSnippet || item.title,
          url: item.link,
          source,
          published_at: item.pubDate,
        });
      }
    } catch (err) {
      console.error(`[RSS] Failed to fetch ${url}:`, err.message);
    }
  }

  console.log(`[RSS] Collected ${articles.length} unique articles from ${RSS_FEEDS.length} feeds`);
  return articles;
}

module.exports = { fetchArticles };
