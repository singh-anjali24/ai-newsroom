# AI Newsroom

An autonomous AI-powered newsroom that discovers, summarizes, and publishes news articles — built with [OpenClaw](https://openclaw.ai/), [Supabase](https://supabase.com/), [Next.js](https://nextjs.org/), and deployed on [Vercel](https://vercel.com/).

Built as part of an AI/ML Engineering take-home assignment focused on autonomous agents, cloud deployment, and full-stack AI systems engineering.

**Live URL:** [https://ai-newsroom-psi.vercel.app](https://ai-newsroom-psi.vercel.app)

## Overview

AI Newsroom uses multiple cooperating agents orchestrated through OpenClaw on a Linux VPS. The pipeline fetches articles from Google News RSS, generates AI-powered summaries via Ollama Cloud, stores them in Supabase, and serves them through a responsive Next.js frontend. A cron job triggers the pipeline every 5 hours, and a Telegram bot provides real-time observability and manual control.

## Architecture

```
Google News RSS
       |
  OpenClaw (VPS)
       |
  ┌────┴─────┐
  |  Agents  |
  |----------|
  | Fetcher  |──→ RSS Feed
  | Summarizer|──→ Ollama Cloud (ministral-3:3b)
  | DB Writer |──→ Supabase
  └────┬─────┘
       |
  Supabase (PostgreSQL)
       |
  Next.js Frontend
       |
  Vercel (Edge)
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | OpenClaw | Multi-agent orchestration on VPS |
| LLM | Ollama Cloud | AI summarization (ministral-3:3b) |
| Database | Supabase | PostgreSQL storage for articles |
| Frontend | Next.js 16 | Server-rendered React app with dark/light theme |
| Hosting | Vercel | Production deployment with CI/CD |
| Messaging | Telegram Bot | Observability and manual pipeline control |

## Multi-Agent Architecture

The pipeline is split into cooperating agents, each with a single responsibility:

| Agent | File | Role |
|-------|------|------|
| RSS Fetcher | `agent/agents/rssFetcher.js` | Collects articles from Google News RSS |
| Summarizer | `agent/agents/summarizer.js` | Generates 2-sentence AI summaries via Ollama Cloud |
| DB Writer | `agent/agents/dbWriter.js` | Inserts articles into Supabase, handles duplicates |
| Orchestrator | `agent/agents/newsAgent.js` | Coordinates fetch → summarize → store |

Each agent is also exposed as an OpenClaw skill, invocable via Telegram:

| Skill | Command | Description |
|-------|---------|-------------|
| fetch-news | `/fetch-news` | Run the full pipeline |
| fetch-rss | `/fetch-rss` | Fetch RSS articles only |
| summarize | `/summarize` | Summarize any text |
| db-status | `/db-status` | Check article count and latest entries |

## Project Structure

```
ai-newsroom/
├── agent/
│   ├── agents/                # Core agent modules
│   │   ├── rssFetcher.js      # RSS collection agent
│   │   ├── summarizer.js      # AI summarization agent
│   │   ├── dbWriter.js        # Database storage agent
│   │   └── newsAgent.js       # Orchestrator agent
│   ├── runners/               # Standalone wrappers for OpenClaw skills
│   │   ├── fetch.js           # Run RSS fetcher independently
│   │   ├── summarize.js       # Run summarizer independently
│   │   └── status.js          # Check database status
│   ├── skills/                # OpenClaw skill definitions
│   │   ├── fetch-news/        # Full pipeline skill
│   │   ├── fetch-rss/         # RSS-only skill
│   │   ├── summarize/         # Summarization skill
│   │   └── db-status/         # Database status skill
│   ├── index.js               # Main entry point
│   ├── notify.js              # Cron entry with Telegram notifications
│   ├── openclaw.example.json  # OpenClaw config template
│   ├── .env.example           # Environment variables template
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main page (SSR, fetches from Supabase)
│   │   ├── layout.tsx         # Root layout with theme support
│   │   └── globals.css        # Theme variables (light/dark)
│   ├── components/
│   │   └── ThemeToggle.tsx    # Dark/light theme toggle
│   ├── lib/
│   │   └── supabase.ts       # Supabase client
│   ├── .env.example           # Frontend env template
│   └── package.json
├── schema.sql                 # Database schema for Supabase
└── README.md
```

## Redeployment Guide

### Prerequisites

- Node.js 22+
- A [Supabase](https://supabase.com/) project (free tier)
- A Linux VPS (Azure, AWS, Oracle, etc.)
- A [Vercel](https://vercel.com/) account
- An [Ollama Cloud](https://ollama.com/) API key (free tier)
- A Telegram bot token (via [@BotFather](https://t.me/BotFather))

### 1. Database Setup

Create a Supabase project, then run `schema.sql` in the Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT NOT NULL UNIQUE,
  source TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Frontend Deployment (Vercel)

```bash
cd frontend
cp .env.example .env.local
# Fill in your Supabase URL and anon key in .env.local
npm install
npm run build
```

Deploy to Vercel:
- Import the repo on [vercel.com](https://vercel.com)
- Set root directory to `frontend`
- Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. VPS Setup

SSH into your VPS and install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Clone the repo and install agent dependencies:

```bash
git clone https://github.com/singh-anjali24/ai-newsroom.git
cd ai-newsroom/agent
npm install
```

Create the `.env` file:

```bash
cp .env.example .env
# Fill in your keys:
# SUPABASE_URL, SUPABASE_KEY, OLLAMA_API_KEY,
# TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
```

Test the pipeline:

```bash
node index.js
```

### 4. OpenClaw Setup

Install OpenClaw globally:

```bash
sudo npm install -g openclaw
```

Copy and configure OpenClaw:

```bash
cp agent/openclaw.example.json ~/.openclaw/openclaw.json
# Edit ~/.openclaw/openclaw.json with your Ollama API key and Telegram bot token
```

Run the doctor and install the gateway:

```bash
openclaw doctor --fix
openclaw gateway install
openclaw gateway start
```

### 5. Telegram Bot Pairing

1. Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
2. Add the bot token to `~/.openclaw/openclaw.json` under `channels.telegram.botToken`
3. Restart the gateway: `openclaw gateway restart`
4. DM your bot — it will show a pairing code
5. Approve it: `openclaw pairing approve telegram <CODE>`

### 6. Cron Automation

Set up a cron job to run the pipeline every 5 hours with Telegram notifications:

```bash
crontab -e
```

Add this line:

```
0 */5 * * * /home/azureuser/ai-newsroom/agent/cron-run.sh
```

This script triggers the pipeline through the OpenClaw agent runtime, sends a Telegram notification, runs a health check, and rotates logs.

## Observability

- **Telegram notifications** — auto-sent after every pipeline run with insert/skip counts
- **Manual control** — message `/fetch-news` to the Telegram bot anytime
- **Pipeline logs** — `~/agent.log` on the VPS tracks every run with timestamps
- **Database status** — message `/db-status` to check article count

## Cost

This entire system runs on free tiers with $0 spend:

| Service | Tier | Cost |
|---------|------|------|
| Azure VPS | Free trial ($200 credit) | $0 |
| Supabase | Free tier | $0 |
| Vercel | Free tier | $0 |
| Ollama Cloud | Free tier | $0 |
| Telegram Bot | Free | $0 |

The pipeline runs every 5 hours, processing 5 articles per run. With the ministral-3:3b model, token usage stays well within Ollama Cloud's free tier rate limits.

## License

This project is licensed under the [MIT License](LICENSE).
