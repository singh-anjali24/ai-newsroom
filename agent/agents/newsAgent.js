const { fetchArticles } = require("./rssFetcher");
const { generateSummary } = require("./summarizer");
const { insertArticle } = require("./dbWriter");

/**
 * Main orchestrator agent.
 * Coordinates the full pipeline: fetch → summarize → store.
 */
async function run() {
  console.log("\n[Agent] Starting news ingestion pipeline...\n");

  let articles;
  try {
    articles = await fetchArticles();
    console.log(`[Agent] Fetched ${articles.length} articles from RSS\n`);
  } catch (err) {
    console.error("[Agent] RSS fetch failed:", err.message);
    return;
  }

  let inserted = 0;
  let skipped = 0;

  for (const item of articles) {
    console.log(`[Agent] Processing: ${item.title}`);

    const summary = await generateSummary(item.content);

    const result = await insertArticle({
      title: item.title,
      summary,
      url: item.url,
      source: item.source,
      published_at: item.published_at,
    });

    if (result.success) {
      console.log(`[Agent] Inserted successfully\n`);
      inserted++;
    } else {
      skipped++;
      console.log("");
    }
  }

  console.log(
    `[Agent] Pipeline complete — ${inserted} inserted, ${skipped} skipped\n`
  );
}

module.exports = { run };
