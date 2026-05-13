const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Inserts an article into the Supabase database.
 * Handles duplicate URLs gracefully via the unique constraint.
 * Returns { success: boolean, error?: string }.
 */
async function insertArticle(article) {
  const { error } = await supabase.from("articles").insert({
    title: article.title,
    summary: article.summary,
    category: article.category || "General",
    url: article.url,
    source: article.source,
    published_at: article.published_at,
  });

  if (error) {
    if (error.code === "23505") {
      console.log("[DB] Skipped (duplicate):", article.title);
      return { success: false, error: "duplicate" };
    }
    console.error("[DB] Insert error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Records a pipeline run timestamp with stats.
 * Upserts a single row (id=1) so we always know when the last run happened,
 * regardless of whether new articles were found.
 */
async function recordPipelineRun({ articlesFound, articlesInserted }) {
  const { error } = await supabase.from("pipeline_runs").upsert(
    {
      id: 1,
      last_run_at: new Date().toISOString(),
      articles_found: articlesFound,
      articles_inserted: articlesInserted,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[DB] Failed to record pipeline run:", error.message);
  } else {
    console.log("[DB] Pipeline run recorded");
  }
}

module.exports = { insertArticle, recordPipelineRun };
