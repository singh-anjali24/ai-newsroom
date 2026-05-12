const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const { fetchArticles } = require('./agents/rssFetcher');

fetchArticles().then(articles => {
  console.log('[RSS Agent] Fetched ' + articles.length + ' articles:');
  articles.forEach((a, i) => {
    console.log((i+1) + '. ' + a.title + ' (' + a.source + ')');
  });
}).catch(err => {
  console.error('[RSS Agent] Error:', err.message);
});
