"use client";

import { useState } from "react";

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  url: string;
  source: string;
  published_at: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI Models": "#8b5cf6",
  "Business": "#f59e0b",
  "Policy & Regulation": "#ef4444",
  "Research": "#06b6d4",
  "Ethics & Safety": "#ec4899",
  "Products & Tools": "#10b981",
  "General": "#6b7280",
};

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

export default function CategoryFilter({ articles }: { articles: Article[] }) {
  const categories = ["All", ...Object.keys(
    articles.reduce((acc, a) => {
      acc[a.category || "General"] = true;
      return acc;
    }, {} as Record<string, boolean>)
  )];

  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? articles
    : articles.filter((a) => (a.category || "General") === active);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = active === cat;
          const color = CATEGORY_COLORS[cat] || "var(--accent)";
          const count = cat === "All"
            ? articles.length
            : articles.filter((a) => (a.category || "General") === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: isActive ? color : "var(--bg-card)",
                color: isActive ? "white" : "var(--text-secondary)",
                border: isActive
                  ? `1px solid ${color}`
                  : "1px solid var(--border)",
                boxShadow: isActive
                  ? `0 2px 8px ${color}33`
                  : "none",
              }}
            >
              {cat !== "All" && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: isActive ? "white" : color,
                  }}
                />
              )}
              {cat}
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "var(--badge-bg)",
                  color: isActive ? "white" : "var(--text-muted)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((article) => {
          const cat = article.category || "General";
          const color = CATEGORY_COLORS[cat] || "#6b7280";

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl p-5 article-card animate-fade-up"
            >
              {/* Meta */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: color }}
                >
                  {cat}
                </span>
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
                className="text-[15px] font-semibold leading-snug mb-2 line-clamp-2"
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
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>
            No articles in this category
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            New articles will be categorized automatically.
          </p>
        </div>
      )}
    </div>
  );
}
