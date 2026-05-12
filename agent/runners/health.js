const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkHealth() {
  const results = [];

  // 1. Check Supabase
  try {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    results.push({ name: "Supabase", status: "ok", detail: `${count} articles` });
  } catch (err) {
    results.push({ name: "Supabase", status: "fail", detail: err.message });
  }

  // 2. Check Ollama Cloud
  try {
    const res = await fetch("https://ollama.com/api/tags", {
      headers: { Authorization: "Bearer " + process.env.OLLAMA_API_KEY },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      results.push({ name: "Ollama Cloud", status: "ok", detail: "Reachable" });
    } else {
      results.push({ name: "Ollama Cloud", status: "fail", detail: `HTTP ${res.status}` });
    }
  } catch (err) {
    results.push({ name: "Ollama Cloud", status: "fail", detail: err.message });
  }

  // 3. Check last ingestion time
  try {
    const { data } = await supabase
      .from("articles")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      const hoursAgo = Math.floor(
        (Date.now() - new Date(data[0].created_at).getTime()) / 3600000
      );
      const stale = hoursAgo > 12;
      results.push({
        name: "Last ingestion",
        status: stale ? "warn" : "ok",
        detail: `${hoursAgo}h ago${stale ? " (stale)" : ""}`,
      });
    } else {
      results.push({ name: "Last ingestion", status: "warn", detail: "No articles found" });
    }
  } catch (err) {
    results.push({ name: "Last ingestion", status: "fail", detail: err.message });
  }

  // 4. Check VPS uptime
  const uptime = Math.floor(require("os").uptime() / 3600);
  results.push({ name: "VPS uptime", status: "ok", detail: `${uptime}h` });

  // Output
  const icons = { ok: "[OK]", warn: "[WARN]", fail: "[FAIL]" };
  console.log("[Health] System Health Check");
  console.log("---");
  results.forEach((r) => {
    console.log(`${icons[r.status]} ${r.name}: ${r.detail}`);
  });

  const hasFailure = results.some((r) => r.status === "fail");
  const hasWarning = results.some((r) => r.status === "warn");

  if (hasFailure) {
    console.log("\n[Health] Status: UNHEALTHY");
    process.exitCode = 1;
  } else if (hasWarning) {
    console.log("\n[Health] Status: DEGRADED");
  } else {
    console.log("\n[Health] Status: HEALTHY");
  }

  return { results, hasFailure, hasWarning };
}

module.exports = { checkHealth };

if (require.main === module) {
  checkHealth();
}
