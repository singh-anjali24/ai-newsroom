export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">
              AI
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AI Newsroom
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#stack" className="hover:text-white transition-colors">
              Stack
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 px-4 py-2 hover:border-zinc-500 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400 mb-6">
          Powered by OpenClaw + Supabase
        </div>
        <h1 className="text-5xl font-bold tracking-tight leading-tight sm:text-6xl">
          News, discovered and
          <br />
          summarized by{" "}
          <span className="text-indigo-500">AI agents</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          An autonomous pipeline that pulls articles from Google News RSS,
          generates AI-powered summaries, and publishes them to a modern reading
          interface — on a scheduled cron, no human in the loop.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#features"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Explore Features
          </a>
          <a
            href="#stack"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            View Stack
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-center text-zinc-400 mb-12 max-w-xl mx-auto">
          From RSS feed to published article — fully autonomous.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Discover",
              description:
                "OpenClaw agent monitors Google News RSS feeds for new articles on a scheduled cron job.",
            },
            {
              step: "02",
              title: "Summarize",
              description:
                "Each article is processed through an LLM to generate a concise, editorial-quality summary.",
            },
            {
              step: "03",
              title: "Store",
              description:
                "Articles and metadata are stored in a Supabase PostgreSQL database for fast retrieval.",
            },
            {
              step: "04",
              title: "Publish",
              description:
                "The Next.js frontend renders articles with server-side rendering, deployed on Vercel.",
            },
          ].map((feature) => (
            <div
              key={feature.step}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="mb-3 text-xs font-mono text-indigo-500">
                {feature.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="stack" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
          Tech Stack
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "OpenClaw",
              role: "AI Agent",
              description: "Autonomous news fetching and summarization",
            },
            {
              name: "Supabase",
              role: "Database",
              description: "PostgreSQL storage for articles and metadata",
            },
            {
              name: "Next.js",
              role: "Frontend",
              description: "Server-rendered React reading interface",
            },
            {
              name: "Vercel",
              role: "Hosting",
              description: "Edge deployment and CI/CD pipeline",
            },
          ].map((tech) => (
            <div
              key={tech.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center hover:border-zinc-700 transition-colors"
            >
              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-indigo-500">
                {tech.role}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{tech.name}</h3>
              <p className="text-sm text-zinc-400">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between text-sm text-zinc-500">
          <span>AI Newsroom</span>
          <span>Built with OpenClaw, Supabase, Next.js & Vercel</span>
        </div>
      </footer>
    </div>
  );
}
