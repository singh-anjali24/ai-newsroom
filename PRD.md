# Product Requirements Document (PRD)

## AI Newsroom — Autonomous AI-Powered News Platform

**Version:** 1.0
**Author:** Anjali Singh
**Date:** May 2026
**Status:** Shipped

---

## 1. Executive Summary

AI Newsroom is an autonomous news discovery and publishing platform that uses multiple cooperating AI agents to collect, summarize, categorize, and publish AI industry news. The system runs entirely on free-tier infrastructure with zero ongoing cost, demonstrating production-grade AI systems engineering.

**Live URL:** [https://ai-newsroom-psi.vercel.app](https://ai-newsroom-psi.vercel.app)
**Repository:** [https://github.com/singh-anjali24/ai-newsroom](https://github.com/singh-anjali24/ai-newsroom)

---

## 2. Problem Statement

Staying current with AI industry news requires monitoring dozens of sources daily. Manual curation is time-consuming and inconsistent. There is a need for an automated system that can:

- Discover relevant articles from multiple sources
- Generate concise, readable summaries
- Categorize articles by topic
- Present them in a clean, accessible interface
- Run autonomously without human intervention

---

## 3. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Autonomous operation | Uptime without manual intervention | 7+ days |
| Fresh content | Time between ingestion runs | Every 5 hours |
| Article coverage | Articles ingested per run | 10-20 per run |
| Zero cost | Total infrastructure spend | $0 |
| Observability | Alert on pipeline failure | < 5 minutes via Telegram |

### Non-Goals

- User authentication or accounts
- Article commenting or social features
- Custom RSS feed selection by end users
- Real-time streaming updates

---

## 4. System Architecture

### High-Level Flow

```
Google News RSS (3 feeds)
        |
   OpenClaw Runtime (Azure VPS)
        |
   ┌────┴──────────┐
   |    Agents      |
   |----------------|
   | RSS Fetcher    |──→ Google News RSS
   | Summarizer     |──→ Ollama Cloud (ministral-3:8b)
   | Categorizer    |──→ Keyword classification
   | DB Writer      |──→ Supabase PostgreSQL
   | Health Check   |──→ System diagnostics
   | Orchestrator   |──→ Coordinates all agents
   └────┬──────────┘
        |
   Supabase (PostgreSQL)
        |
   Next.js 16 Frontend
        |
   Vercel (Edge CDN)
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Agent Runtime | OpenClaw | 2026.5.7 | Multi-agent orchestration, Telegram integration |
| LLM Provider | Ollama Cloud | Free tier | AI summarization (ministral-3:8b) |
| Database | Supabase | Free tier | PostgreSQL storage, real-time data |
| Frontend | Next.js | 16.2.5 | Server-rendered React application |
| UI Framework | Tailwind CSS | 4.x | Styling with dark/light theme |
| Hosting | Vercel | Free tier | Edge deployment, CI/CD |
| Compute | Azure VPS | B2ats_v2 | Ubuntu 24.04, 2 vCPU, 4GB RAM |
| Messaging | Telegram Bot | - | Observability, manual control |
| Scheduler | Cron | System | Pipeline automation every 5 hours |

---

## 5. Multi-Agent Architecture

### 5.1 RSS Fetcher Agent

**File:** `agent/agents/rssFetcher.js`
**Responsibility:** Article discovery

| Specification | Detail |
|--------------|--------|
| Data sources | 3 Google News RSS feeds |
| Query topics | "AI", "artificial intelligence LLM", "OpenAI OR Anthropic OR Google AI" |
| Articles per feed | Up to 10 |
| Deduplication | URL-based dedup before processing |
| Output | Normalized article objects (title, content, url, source, published_at) |

### 5.2 Summarizer Agent

**File:** `agent/agents/summarizer.js`
**Responsibility:** AI-powered article summarization

| Specification | Detail |
|--------------|--------|
| LLM Provider | Ollama Cloud |
| Model | ministral-3:8b |
| Prompt | "Summarize this AI news article in 2 concise sentences" |
| Fallback | Returns "Summary unavailable." on failure |
| Auth | Bearer token via OLLAMA_API_KEY |

### 5.3 Categorizer Agent

**File:** `agent/agents/categorizer.js`
**Responsibility:** Article classification

| Specification | Detail |
|--------------|--------|
| Method | Keyword-based classification (zero LLM cost) |
| Categories | AI Models, Business, Policy & Regulation, Research, Ethics & Safety, Products & Tools, General |
| Input | Article title + summary |
| Algorithm | Weighted keyword matching, highest score wins |

### 5.4 DB Writer Agent

**File:** `agent/agents/dbWriter.js`
**Responsibility:** Data persistence

| Specification | Detail |
|--------------|--------|
| Database | Supabase PostgreSQL |
| Duplicate handling | Unique constraint on URL (error code 23505) |
| Pipeline tracking | Upserts pipeline_runs table with run stats |
| Error handling | Graceful logging, continues on failure |

### 5.5 Health Check Agent

**File:** `agent/runners/health.js`
**Responsibility:** System monitoring

| Check | What it monitors |
|-------|-----------------|
| Supabase | Database connectivity, article count |
| Ollama Cloud | API reachability |
| Last ingestion | Staleness detection (warns if > 12h) |
| VPS uptime | System uptime in hours |

### 5.6 Orchestrator Agent

**File:** `agent/agents/newsAgent.js`
**Responsibility:** Pipeline coordination

```
fetchArticles() → for each article:
  generateSummary() → categorize() → insertArticle()
  → recordPipelineRun()
```

---

## 6. Database Schema

### articles

| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | Primary key, auto-increment |
| title | TEXT | NOT NULL |
| summary | TEXT | Nullable |
| category | TEXT | DEFAULT 'General' |
| url | TEXT | NOT NULL, UNIQUE |
| source | TEXT | Nullable |
| published_at | TIMESTAMPTZ | Nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

**Indexes:** `idx_articles_published_at` (published_at DESC)

### pipeline_runs

| Column | Type | Constraint |
|--------|------|-----------|
| id | INT | Primary key, CHECK (id = 1) |
| last_run_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| articles_found | INT | DEFAULT 0 |
| articles_inserted | INT | DEFAULT 0 |

---

## 7. OpenClaw Integration

### Gateway Configuration

- **Mode:** Local (systemd service on VPS)
- **Model:** ollama/ministral-3:8b
- **Channel:** Telegram (bot paired via DM pairing)
- **Workspace:** `/home/azureuser/ai-newsroom/agent`

### Registered Skills

| Skill | Command | Type |
|-------|---------|------|
| fetch-news | `/fetch-news` | Full pipeline execution |
| fetch-rss | `/fetch-rss` | RSS fetch only |
| summarize | `/summarize` | On-demand text summarization |
| db-status | `/db-status` | Database status check |
| health | `/health` | System health diagnostics |

### Cron Automation

```
0 */5 * * * /home/azureuser/ai-newsroom/agent/cron-run.sh
```

**cron-run.sh flow:**
1. Triggers pipeline via `openclaw agent --agent main --local --message '/fetch-news'`
2. Sends Telegram notification via `notify-only.js`
3. Runs health check, alerts on failure
4. Rotates logs (keeps last 500 lines)

---

## 8. Frontend Specifications

### Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Dynamic (SSR) | Main news feed with category filtering |

### Features

| Feature | Implementation |
|---------|---------------|
| Dark/Light theme | CSS variables + localStorage, no flash on reload |
| Category filter tabs | Client component with colored active states |
| Responsive design | Mobile, tablet, desktop breakpoints |
| Live status badge | Shows "Updated Xm ago" with animated pulse |
| Stats bar | Article count, source count, refresh interval |
| Article cards | 2-column grid with hover lift, shadow, and arrow animation |
| Pipeline section | 5-step visual explanation of the system |
| Force-dynamic | `export const dynamic = "force-dynamic"` ensures fresh data |

### Theme System

| Variable | Light | Dark |
|----------|-------|------|
| --bg | #fafafa | #09090b |
| --bg-card | #ffffff | #111114 |
| --text-primary | #0a0a0a | #fafafa |
| --text-secondary | #525252 | #a1a1aa |
| --accent | #6366f1 | #818cf8 |
| --border | #e5e5e5 | #1e1e24 |

---

## 9. Observability

| Channel | What | When |
|---------|------|------|
| Telegram notification | Pipeline report (inserted/skipped counts) | After every cron run |
| Telegram alert | Health failure details | Only when something breaks |
| Telegram command | `/health` system status | On demand |
| Telegram command | `/db-status` article count | On demand |
| VPS log file | Full pipeline output | Every run, auto-rotated |

---

## 10. Security

| Concern | Mitigation |
|---------|-----------|
| API keys in repo | `.env` files gitignored, `.env.example` templates provided |
| OpenClaw config | `openclaw.json` gitignored, `openclaw.example.json` in repo |
| VPS access | SSH key authentication only |
| Telegram bot | DM pairing policy, owner-only command approval |
| Database | Supabase anon key (read-only Row Level Security) |

---

## 11. Cost Analysis

| Service | Tier | Monthly Cost | Usage |
|---------|------|-------------|-------|
| Azure VPS | Free trial ($200 credit) | $0 | B2ats_v2, expires June 9 |
| Supabase | Free tier | $0 | < 500MB database |
| Vercel | Free tier | $0 | Hobby plan |
| Ollama Cloud | Free tier | $0 | ~20 articles/day, ministral-3:8b |
| Telegram Bot API | Free | $0 | Unlimited messages |
| **Total** | | **$0/month** | |

### Token Efficiency

- Pipeline runs every 5 hours (4.8 runs/day)
- ~20 articles per run, each gets a 2-sentence summary
- Categorization uses keyword matching (zero LLM tokens)
- ministral-3:8b is a small, efficient model

---

## 12. Deployment Architecture

```
┌─────────────────────────────────┐
│         Azure VPS               │
│  ┌─────────────────────────┐    │
│  │  OpenClaw Gateway       │    │
│  │  (systemd service)      │    │
│  │  ┌───────────────────┐  │    │
│  │  │  Agent Workspace  │  │    │
│  │  │  - agents/        │  │    │
│  │  │  - runners/       │  │    │
│  │  │  - skills/        │  │    │
│  │  └───────────────────┘  │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Cron (every 5h)        │    │
│  │  → cron-run.sh          │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│  Ollama Cloud    │  │  Telegram API    │
│  (LLM inference) │  │  (notifications) │
└──────────────────┘  └──────────────────┘
           │
           ▼
┌──────────────────┐
│  Supabase        │
│  (PostgreSQL)    │
└──────────────────┘
           │
           ▼
┌──────────────────┐
│  Vercel          │
│  (Next.js SSR)   │
└──────────────────┘
```

---

## 13. Project Structure

```
ai-newsroom/
├── agent/
│   ├── agents/                # Core agent modules
│   │   ├── rssFetcher.js      # RSS collection (3 feeds)
│   │   ├── summarizer.js      # AI summarization (Ollama Cloud)
│   │   ├── categorizer.js     # Keyword-based classification
│   │   ├── dbWriter.js        # Supabase storage + pipeline tracking
│   │   └── newsAgent.js       # Orchestrator
│   ├── runners/               # Standalone wrappers for OpenClaw skills
│   │   ├── fetch.js
│   │   ├── summarize.js
│   │   ├── status.js
│   │   └── health.js
│   ├── skills/                # OpenClaw skill definitions (SKILL.md)
│   │   ├── fetch-news/
│   │   ├── fetch-rss/
│   │   ├── summarize/
│   │   ├── db-status/
│   │   └── health/
│   ├── index.js               # Main entry point
│   ├── notify-only.js         # Telegram notification + health alerts
│   ├── cron-run.sh            # Cron entry via OpenClaw
│   ├── openclaw.example.json  # OpenClaw config template
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main page (SSR, category tabs)
│   │   ├── layout.tsx         # Root layout with theme
│   │   └── globals.css        # Light/dark theme variables
│   ├── components/
│   │   ├── ThemeToggle.tsx     # Dark/light toggle
│   │   └── CategoryFilter.tsx # Interactive category tabs
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── .env.example
│   └── package.json
├── schema.sql                 # Database schema
├── PRD.md                     # This document
├── LICENSE                    # MIT License
└── README.md                  # Setup & redeployment guide
```

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Ollama Cloud rate limiting | Medium | Summaries fail | 5-hour interval, fallback text, small model |
| Azure credits expire | Low | VPS stops | $18,900 credits, expires June 9 |
| Supabase pauses | Low | No data | Cron keeps database active |
| RSS feed changes | Low | No articles | Multiple feeds, error handling per feed |
| Duplicate articles | High | DB bloat | Unique URL constraint, graceful skip |
| VPS crashes | Low | Pipeline stops | Systemd auto-restart, health alerts |

---

## 15. Future Enhancements

- Sentiment analysis agent (positive/negative/neutral scoring)
- Multi-topic support (user-configurable RSS feeds)
- Article deduplication by content similarity (not just URL)
- Email digest notifications
- Admin dashboard with pipeline run history
- Search functionality across articles
- RSS output feed for downstream consumers

---

## 16. Design Decisions

| Decision | Rationale |
|----------|-----------|
| Keyword categorization over LLM | Zero additional token cost, instant classification, predictable results |
| ministral-3:8b over larger models | Free tier compatible, sufficient for 2-sentence summaries |
| Single articles table | All article data fits naturally; separate tables would be over-engineering |
| force-dynamic on frontend | Ensures fresh data on every page load, no stale cache |
| OpenClaw skills as SKILL.md | Standard OpenClaw pattern, discoverable by the gateway |
| Cron via cron-run.sh | Routes through OpenClaw CLI while maintaining Telegram notifications |
| CSS variables for theming | Works with server components, no hydration mismatch |
