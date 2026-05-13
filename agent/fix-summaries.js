const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { generateSummary } = require("./agents/summarizer");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title")
    .eq("summary", "Summary unavailable.");

  if (error) {
    console.error("Query error:", error.message);
    return;
  }

  console.log("Found", data.length, "articles to fix\n");

  let fixed = 0;
  let failed = 0;

  for (const a of data) {
    console.log("Re-summarizing:", a.title);
    const summary = await generateSummary(a.title);
    if (summary !== "Summary unavailable.") {
      await supabase.from("articles").update({ summary }).eq("id", a.id);
      console.log("Updated\n");
      fixed++;
    } else {
      console.log("Still failed — skipping\n");
      failed++;
    }
  }

  console.log(`Done — ${fixed} fixed, ${failed} still failed`);
})();
