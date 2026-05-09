import { supabase } from "@/lib/supabase";

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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold tracking-tight shadow-lg shadow-indigo-500/20">
              AI
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AI Newsroom
            </span>
          </div>
          <div className="flex items-center gap-4">
            {articleCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {articleCount} articles
              </span>
            )}
            <a
              href="https://github.com/singh-anjali24/ai-newsroom"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Autonomous AI Pipeline
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            News, discovered and
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              summarized by AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            An autonomous agent pulls articles from Google News, generates
            AI-powered summaries, and publishes them here — on a scheduled
            cron, no human in the loop.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 pb-24">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Latest Articles
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              AI-curated and summarized from top sources
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">
              Failed to load articles
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && articleCount === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="text-zinc-300 font-medium">
              No articles yet
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              The AI agent hasn&apos;t ingested any articles yet. Run the
              pipeline to get started.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!error && articleCount > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {articles!.map((article) => (
              <article
                key={article.id}
                className="group relative flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-indigo-500/30 hover:bg-zinc-900/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
              >
                {/* Source Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                    {article.source}
                  </span>
                  <time
                    dateTime={article.published_at}
                    className="text-xs text-zinc-500"
                  >
                    {timeAgo(article.published_at)}
                  </time>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-base font-semibold leading-snug text-zinc-100 group-hover:text-white transition-colors line-clamp-3">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="mb-6 flex-1 text-sm leading-7 text-zinc-400 line-clamp-4">
                  {article.summary}
                </p>

                {/* CTA */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Read full article
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                    />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[8px] font-bold">
              AI
            </div>
            <span>AI Newsroom</span>
          </div>
          <span>
            Built with Next.js, Supabase, and AI-powered automation
          </span>
        </div>
      </footer>
    </div>
  );
}
