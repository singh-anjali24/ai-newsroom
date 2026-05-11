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

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  const articleCount = articles?.length ?? 0;
  const lastUpdated = articles?.[0]?.created_at || articles?.[0]?.published_at;

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
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              AI
            </div>
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              AI Newsroom
            </span>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-secondary)",
                }}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Updated {timeAgo(lastUpdated)}
              </span>
            )}
            <ThemeToggle />
            <a
              href="https://github.com/singh-anjali24/ai-newsroom"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                background: "var(--bg-card)",
              }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-5xl px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-6"
            style={{
              background: "var(--accent-light)",
              color: "var(--accent-text)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Autonomous AI Pipeline
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            AI-curated news,
            <br />
            delivered fresh.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            An autonomous agent discovers, summarizes, and publishes the latest
            AI news — updated every 30 minutes, no human in the loop.
          </p>
        </div>
        {articleCount > 0 && (
          <div
            className="flex items-center gap-4 mt-8 pt-8 text-sm"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-2 w-2 rounded-full animate-pulse"
                style={{ background: "#22c55e" }}
              />
              <span style={{ color: "var(--text-muted)" }}>
                {articleCount} articles
              </span>
            </div>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ color: "var(--text-muted)" }}>
              Cron runs every 30 min
            </span>
            {lastUpdated && (
              <>
                <span style={{ color: "var(--border)" }}>|</span>
                <span style={{ color: "var(--text-muted)" }}>
                  Last ingestion: {timeAgo(lastUpdated)}
                </span>
              </>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20">
        {/* Error State */}
        {error && (
          <div
            className="rounded-xl p-8 text-center mb-8"
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
              The pipeline runs every 30 minutes. Articles will appear
              automatically.
            </p>
          </div>
        )}

        {/* Articles */}
        {!error && articleCount > 0 && (
          <div className="space-y-3">
            {articles!.map((article, i) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl p-5 sm:p-6 transition-all duration-200 article-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-2.5">
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
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {timeAgo(article.published_at)}
                      </span>
                      {i === 0 && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
                          style={{
                            background: "var(--accent-light)",
                            color: "var(--accent-text)",
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="text-[15px] sm:text-base font-semibold leading-snug mb-2 line-clamp-2 transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {article.title}
                    </h2>

                    {/* Summary */}
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {article.summary}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div
                    className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <svg
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded flex items-center justify-center text-[8px] font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              AI
            </div>
            <span>AI Newsroom</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Next.js</span>
            <span>Supabase</span>
            <span>OpenClaw</span>
            <span>Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
