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
  const latestArticle = articles?.[0];
  const remainingArticles = articles?.slice(1);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold tracking-tight shadow-lg shadow-indigo-500/25">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 blur-lg opacity-40" />
              <span className="relative">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight leading-tight">
                AI Newsroom
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
                Autonomous Pipeline
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {articleCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {articleCount} articles live
              </span>
            )}
            <a
              href="https://github.com/singh-anjali24/ai-newsroom"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Source
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-violet-500/[0.05] rounded-full blur-[100px]" />
          <div className="absolute top-10 right-1/4 w-[250px] h-[250px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.07] px-4 py-2 text-xs font-medium text-indigo-300 mb-8 shadow-lg shadow-indigo-500/5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Powered by AI Agents
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            News, discovered
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              and summarized by AI
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            An autonomous agent discovers articles from Google News, generates
            AI-powered summaries, and publishes them here — fully automated,
            no human in the loop.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              RSS Ingestion
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              AI Summarization
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Auto Publishing
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Latest Articles
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              AI-curated and summarized from top news sources worldwide
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 px-4 py-2.5 text-xs text-zinc-500">
            <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
            </svg>
            Updates every 30 minutes
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-10 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 font-semibold text-lg">
              Failed to load articles
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && articleCount === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-20 text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center">
              <svg className="h-7 w-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="text-zinc-200 font-semibold text-lg">
              No articles yet
            </p>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
              The AI agent hasn&apos;t ingested any articles yet. The pipeline
              runs every 30 minutes automatically.
            </p>
          </div>
        )}

        {/* Featured Article */}
        {!error && latestArticle && (
          <a
            href={latestArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-900/80 p-8 sm:p-10 mb-8 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/[0.06] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px] group-hover:bg-indigo-500/[0.06] transition-all duration-700" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Latest
                </span>
                <span className="inline-flex items-center rounded-full bg-zinc-800/80 border border-zinc-700/50 px-3 py-1 text-xs font-medium text-zinc-400">
                  {latestArticle.source}
                </span>
                <time className="text-xs text-zinc-600">
                  {timeAgo(latestArticle.published_at)}
                </time>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-zinc-50 group-hover:text-white transition-colors mb-4">
                {latestArticle.title}
              </h3>
              <p className="text-base leading-relaxed text-zinc-400 max-w-3xl mb-6">
                {latestArticle.summary}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                Read full article
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </span>
            </div>
          </a>
        )}

        {/* Articles Grid */}
        {!error && remainingArticles && remainingArticles.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {remainingArticles.map((article) => (
              <article
                key={article.id}
                className="group relative flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 hover:border-indigo-500/25 hover:bg-zinc-900/60 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/[0.04] transition-all duration-300"
              >
                {/* Source & Time */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-zinc-800/80 border border-zinc-700/40 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                    {article.source}
                  </span>
                  <time
                    dateTime={article.published_at}
                    className="text-[11px] text-zinc-600 font-medium"
                  >
                    {timeAgo(article.published_at)}
                  </time>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-[15px] font-semibold leading-snug text-zinc-100 group-hover:text-white transition-colors line-clamp-3">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="mb-6 flex-1 text-sm leading-7 text-zinc-500 group-hover:text-zinc-400 transition-colors line-clamp-3">
                  {article.summary}
                </p>

                {/* CTA */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                >
                  Read more
                  <svg
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
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

      {/* How It Works */}
      <section className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-center text-sm text-zinc-500 mb-12">
            Fully autonomous, from source to screen
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "OpenClaw agent monitors Google News RSS for the latest AI articles.",
                color: "from-indigo-500/20 to-indigo-500/0",
              },
              {
                step: "02",
                title: "Summarize",
                desc: "Each article is processed through an LLM for a concise summary.",
                color: "from-violet-500/20 to-violet-500/0",
              },
              {
                step: "03",
                title: "Store",
                desc: "Articles and metadata are persisted to Supabase PostgreSQL.",
                color: "from-purple-500/20 to-purple-500/0",
              },
              {
                step: "04",
                title: "Publish",
                desc: "Next.js renders articles with SSR, deployed globally on Vercel.",
                color: "from-fuchsia-500/20 to-fuchsia-500/0",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />
                <span className="text-xs font-mono font-bold text-indigo-500/60 mb-3 block">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-[9px] font-bold shadow-md shadow-indigo-500/20">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-400">AI Newsroom</span>
              <span className="text-[11px] text-zinc-600">Autonomous news discovery</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <span>Next.js</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span>Supabase</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span>OpenClaw</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span>Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
