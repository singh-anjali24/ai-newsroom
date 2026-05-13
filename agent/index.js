const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const { run } = require("./agents/newsAgent");

run().catch((err) => {
  console.error("[Agent] Unhandled pipeline error:", err.message);
  process.exitCode = 1;
});
