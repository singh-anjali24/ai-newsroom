const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const { checkHealth } = require("./runners/health");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(message) {
  const url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}

async function main() {
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const msg =
    "*AI Newsroom Pipeline Report*\n\n" +
    "⏰ " + time + "\n" +
    "🤖 Pipeline ran via OpenClaw agent\n" +
    "📋 Check /db-status for article count";

  await sendTelegram(msg);

  // Health check — alert only on failure
  const health = await checkHealth();
  if (health.hasFailure) {
    const failItems = health.results
      .filter((r) => r.status === "fail")
      .map((r) => "• " + r.name + ": " + r.detail)
      .join("\n");
    await sendTelegram("🚨 *Health Alert*\n\n" + failItems);
  }
}

main().catch((err) => {
  sendTelegram("❌ Notification failed: " + err.message);
});
