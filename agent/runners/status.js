const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function status() {
  const { count } = await supabase.from('articles').select('*', { count: 'exact', head: true });
  const { data: latest } = await supabase.from('articles').select('title, source, published_at').order('published_at', { ascending: false }).limit(3);
  console.log('[DB Agent] Total articles:', count);
  console.log('[DB Agent] Latest 3:');
  latest.forEach((a, i) => {
    console.log((i+1) + '. ' + a.title + ' (' + a.source + ')');
  });
}
status().catch(err => console.error('[DB Agent] Error:', err.message));
