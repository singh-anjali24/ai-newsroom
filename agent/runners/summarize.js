const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { generateSummary } = require('../agents/summarizer');

const text = process.argv[2] || 'AI is transforming industries worldwide in 2026.';
generateSummary(text).then(summary => {
  console.log('[Summarizer Agent] Summary:', summary);
}).catch(err => {
  console.error('[Summarizer Agent] Error:', err.message);
});
