const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require("dotenv").config();

const Parser = require("rss-parser");
const { createClient } = require("@supabase/supabase-js");

const parser = new Parser();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fetchNews() {
  try {
    const feed = await parser.parseURL(
      "https://news.google.com/rss/search?q=AI"
    );

    for (const item of feed.items.slice(0, 5)) {
      const article = {
        title: item.title,
        summary: await generateSummary(
            item.contentSnippet || item.title
        ),
        url: item.link,
        source: item.source?.title || "Google News",
        published_at: item.pubDate,
      };

      const { error } = await supabase
        .from("articles")
        .insert(article);

        if (error) {
            console.log("ERROR inserting article:");
            console.log(error);
          } else {
            console.log("Inserted:", article.title);
        }
    }
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

fetchNews();
const { Ollama } = require("ollama");
const ollama = new Ollama({
    host: "https://ollama.com",
  });

  async function generateSummary(text) {
    try {
      const response = await ollama.chat({
        model:"ministral-3:3b",
        messages: [
          {
            role: "user",
            content: `Summarize this AI news article in 2 concise sentences:\n\n${text}`,
          },
        ],
      });
  
      return response.message.content;
    } catch (err) {
      console.error("Summary generation failed:", err);
      return "Summary unavailable.";
    }
  }