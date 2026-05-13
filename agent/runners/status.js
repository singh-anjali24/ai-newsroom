const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function status() {
  const { count, error: countErr } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  if (countErr) {
    console.error('[DB Agent] Count error:', countErr.message);
    return;
  }
  const { data: latest, error: latestErr } = await supabase.from('articles').select('title, source, created_at').order('created_at', { ascending: false }).limit(3);
  if (latestErr) {
    console.error('[DB Agent] Latest query error:', latestErr.message);
    return;
  }
  console.log('[DB Agent] Total articles:', count);
  if (latest && latest.length > 0) {
    console.log('[DB Agent] Last ingested:', new Date(latest[0].created_at).toISOString().split('T')[0]);
    console.log('[DB Agent] Latest 3:');
    latest.forEach((a, i) => {
      console.log((i+1) + '. ' + a.title + ' (' + a.source + ')');
    });
  } else {
    console.log('[DB Agent] No articles found');
  }
}
status().catch(err => console.error('[DB Agent] Error:', err.message));
