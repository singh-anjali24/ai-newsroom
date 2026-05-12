import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen font-sans" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-2xl"
        style={{
          background: "color-mix(in srgb, var(--bg) 85%, transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
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
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--stat-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Updated {timeAgo(lastUpdated)}
              </span>
            )}
            <ThemeToggle />
            <a
              href="https://github.com/singh-anjali24/ai-newsroom"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg flex items-center justify-center github-link"
              aria-label="View source on GitHub"
            >
              <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="mx-auto max-w-5xl px-5 pt-16 pb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-6"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent-text)",
              border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
            }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Autonomous AI Pipeline
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            The latest in AI,
            <br />
            <span style={{ color: "var(--accent)" }}>curated by agents.</span>
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            An autonomous pipeline discovers, summarizes, and publishes AI news
            every 5 hours — no human in the loop.
          </p>

          {/* Stats */}
          {articleCount > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { label: "Articles", value: articleCount.toString() },
                { label: "Sources", value: sources.length.toString() },
                { label: "Refresh", value: "5h" },
                ...(lastUpdated
                  ? [{ label: "Last run", value: timeAgo(lastUpdated) }]
                  : []),
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2 stat-card"
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {/* Error State */}
        {error && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.1)" }}
            >
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 font-semibold">
              Failed to load articles
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && articleCount === 0 && (
          <div
            className="rounded-2xl p-16 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--accent-soft)" }}
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{ color: "var(--accent)" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
              No articles yet
            </p>
            <p className="mt-2 text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              The pipeline runs every 5 hours. Articles will appear automatically.
            </p>
          </div>
        )}

        {/* Featured Article */}
        {!error && latestArticle && (
          <a
            href={latestArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl p-6 sm:p-8 mb-6 featured-card animate-fade-up"
          >
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                style={{
                  background: "var(--accent)",
                  color: "white",
                }}
              >
                Latest
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--badge-bg)",
                  color: "var(--badge-text)",
                  border: "1px solid var(--badge-border)",
                }}
              >
                {latestArticle.source}
              </span>
              <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                {timeAgo(latestArticle.published_at)}
              </span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold leading-snug mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {latestArticle.title}
            </h2>
            <p
              className="text-sm sm:text-[15px] leading-relaxed max-w-3xl mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {latestArticle.summary}
            </p>
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--accent-text)" }}
            >
              Read full article
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </a>
        )}

        {/* Article Grid */}
        {!error && remainingArticles && remainingArticles.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {remainingArticles.map((article, i) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl p-5 article-card animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Meta */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--badge-bg)",
                      color: "var(--badge-text)",
                      border: "1px solid var(--badge-border)",
                    }}
                  >
                    {article.source}
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {timeAgo(article.published_at)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-[15px] font-semibold leading-snug mb-2.5 line-clamp-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {article.title}
                </h3>

                {/* Summary */}
                <p
                  className="text-[13px] leading-relaxed flex-1 line-clamp-3 mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {article.summary}
                </p>

                {/* CTA */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: "var(--accent-text)" }}
                >
                  Read more
                  <svg
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Pipeline Section */}
      <section
        className="py-16"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center mb-10">
            <h2
              className="text-2xl font-bold tracking-tight mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              How it works
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Fully autonomous, from source to screen
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "OpenClaw agent fetches articles from Google News RSS on a 5-hour cron schedule.",
                icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
              },
              {
                num: "02",
                title: "Summarize",
                desc: "Each article is processed through Ollama Cloud for a concise AI-generated summary.",
                icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
              },
              {
                num: "03",
                title: "Store",
                desc: "Articles and metadata are persisted to Supabase with automatic duplicate detection.",
                icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
              },
              {
                num: "04",
                title: "Publish",
                desc: "Next.js renders articles with SSR on Vercel, with real-time Telegram alerts.",
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
              },
            ].map((step) => (
              <div key={step.num} className="rounded-2xl p-5 pipeline-step">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--accent-soft)" }}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      style={{ color: "var(--accent)" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="mx-auto max-w-5xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md flex items-center justify-center text-[8px] font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600">
              AI
            </div>
            <span className="font-medium">AI Newsroom</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
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
