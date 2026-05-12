const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

const { run } = require('./agents/newsAgent');
const { checkHealth } = require('./runners/health');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(message) {
  const url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' }),
  });
}

const origLog = console.log;
const origErr = console.error;
let logs = [];

console.log = (...args) => { logs.push(args.join(' ')); origLog(...args); };
console.error = (...args) => { logs.push(args.join(' ')); origErr(...args); };

run().then(async () => {
  const output = logs.join('\n');
  const inserted = (output.match(/Inserted successfully/g) || []).length;
  const skipped = (output.match(/Skipped/g) || []).length;
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const msg = '*AI Newsroom Pipeline Report*\n\n' +
    '⏰ ' + time + '\n' +
    '✅ Inserted: ' + inserted + '\n' +
    '⏭️ Skipped: ' + skipped + '\n' +
    '📊 Total processed: ' + (inserted + skipped);

  await sendTelegram(msg);

  // Run health check — only alert if something is wrong
  console.log = origLog;
  console.error = origErr;
  const health = await checkHealth();
  if (health.hasFailure) {
    const failItems = health.results
      .filter((r) => r.status === 'fail')
      .map((r) => '• ' + r.name + ': ' + r.detail)
      .join('\n');
    await sendTelegram('🚨 *Health Alert*\n\n' + failItems);
  }
}).catch(async (err) => {
  await sendTelegram('❌ Pipeline failed: ' + err.message);
});
