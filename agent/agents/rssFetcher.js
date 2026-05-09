const Parser = require("rss-parser");

const parser = new Parser();
const RSS_URL = "https://news.google.com/rss/search?q=AI";

/**
 * Fetches the latest AI news articles from Google News RSS.
 * Returns the 5 most recent items with normalized fields.
 */
async function fetchArticles() {
  const feed = await parser.parseURL(RSS_URL);

  return feed.items.slice(0, 5).map((item) => ({
    title: item.title,
    content: item.contentSnippet || item.title,
    url: item.link,
    source: item.source?.title || "Google News",
    published_at: item.pubDate,
  }));
}

module.exports = { fetchArticles };
