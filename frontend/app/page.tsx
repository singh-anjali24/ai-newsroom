import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function uniqueSources(articles: { source: string }[]): string[] {
  return [...new Set(articles.map((a) => a.source))];
}

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(15);

  const articleCount = articles?.length ?? 0;
  const lastUpdated = articles?.[0]?.created_at || articles?.[0]?.published_at;
  const sources = articles ? uniqueSources(articles) : [];
  const latestArticle = articles?.[0];
  const remainingArticles = articles?.slice(1);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2.5">
            <div
              className="h-7 w-7 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              AI
            </div>
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              AI Newsroom
            </span>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span
                className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: "#22c55e" }}
                />
                Updated {timeAgo(lastUpdated)}
              </span>
            )}
            <ThemeToggle />
            <a
              href="https://github.com/singh-anjali24/ai-newsroom"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-md flex items-center justify-center transition-colors github-link"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          AI-curated news, delivered fresh.
        </h1>
        <p
          className="text-base max-w-xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          An autonomous agent discovers, summarizes, and publishes the latest AI
          news — updated every 5 hours, no human in the loop.
        </p>

        {/* Stats Bar */}
        {articleCount > 0 && (
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
              {articleCount} articles
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {sources.length} sources
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
              </svg>
              Refreshes every 5 hours
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last ingestion: {timeAgo(lastUpdated)}
              </div>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        {/* Error State */}
        {error && (
          <div
            className="rounded-xl p-10 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-red-500 font-medium">Failed to load articles</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && articleCount === 0 && (
          <div
            className="rounded-xl p-16 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              No articles yet
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              The pipeline runs every 5 hours. Articles will appear
              automatically.
            </p>
          </div>
        )}

        {/* Featured Article */}
        {!error && latestArticle && (
          <a
            href={latestArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl p-6 sm:p-8 mb-5 transition-all duration-200 article-card"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider"
                style={{
                  background: "var(--accent-light)",
                  color: "var(--accent-text)",
                }}
              >
                Latest
              </span>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: "var(--badge-bg)",
                  color: "var(--badge-text)",
                  border: "1px solid var(--badge-border)",
                }}
              >
                {latestArticle.source}
              </span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {timeAgo(latestArticle.published_at)}
              </span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold leading-snug mb-3 transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {latestArticle.title}
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-3xl mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {latestArticle.summary}
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--accent-text)" }}
            >
              Read full article
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </span>
          </a>
        )}

        {/* Article Cards Grid */}
        {!error && remainingArticles && remainingArticles.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {remainingArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl p-5 transition-all duration-200 article-card"
              >
                {/* Meta */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--badge-bg)",
                      color: "var(--badge-text)",
                      border: "1px solid var(--badge-border)",
                    }}
                  >
                    {article.source}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {timeAgo(article.published_at)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-[15px] font-semibold leading-snug mb-2 line-clamp-2 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {article.title}
                </h3>

                {/* Summary */}
                <p
                  className="text-sm leading-relaxed flex-1 line-clamp-3 mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {article.summary}
                </p>

                {/* CTA */}
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: "var(--accent-text)" }}
                >
                  Read more
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded flex items-center justify-center text-[8px] font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              AI
            </div>
            AI Newsroom — Autonomous news discovery
          </div>
          <div className="flex items-center gap-3">
            <span>Next.js</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>Supabase</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>OpenClaw</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
