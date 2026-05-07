# AI Newsroom

An autonomous AI-powered newsroom that discovers, summarizes, and publishes news articles — built with [OpenClaw](https://openclaw.ai/), [Supabase](https://supabase.com/), [Next.js](https://nextjs.org/), and deployed on [Vercel](https://vercel.com/).

Built as part of an AI/ML Engineering take-home assignment focused on autonomous agents, cloud deployment, and full-stack AI systems engineering.

## Overview

AI Newsroom uses an OpenClaw agent to pull articles from Google News RSS, generate AI-powered summaries, store them in Supabase, and serve them through a responsive Next.js frontend. The pipeline runs on a scheduled basis using cron jobs on a VPS.

## Architecture

```
Google News RSS
       |
  OpenClaw Agent
       |
 Supabase Database
       |
  Next.js Frontend
       |
 Vercel Deployment
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Agent | OpenClaw | Fetches news via RSS and generates article summaries |
| Database | Supabase | PostgreSQL storage for articles and metadata |
| Frontend | Next.js | Server-rendered React app for the reading interface |
| Hosting | Vercel | Production deployment and CI/CD |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project
- A Linux VPS with [OpenClaw](https://openclaw.ai/) installed
- A [Vercel](https://vercel.com/) account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-newsroom.git
cd ai-newsroom

# Install dependencies
npm install

# Copy the environment template and fill in your keys
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenClaw
OPENCLAW_API_URL=http://localhost:3001
OPENCLAW_API_KEY=your-openclaw-api-key
```

### Development

```bash
# Start the Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Database Setup

Run the Supabase migrations to set up the database schema:

```bash
npx supabase db push
```

## Deployment

Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Project Structure

```
ai-newsroom/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable React components
├── lib/
│   ├── supabase/         # Supabase client configuration
│   └── openclaw/         # OpenClaw agent integration
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── .env.example          # Environment variable template
```

## Planned Improvements

- Multi-agent article tagging
- Category-based filtering
- Admin monitoring dashboard
- Automated retry handling

## License

This project is licensed under the [MIT License](LICENSE).
