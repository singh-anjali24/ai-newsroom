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

module.exports = { insertArticle };
