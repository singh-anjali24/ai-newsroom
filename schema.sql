-- AI Newsroom Database Schema
-- Run this in the Supabase SQL Editor to create the articles table

CREATE TABLE IF NOT EXISTS articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT DEFAULT 'General',
  url TEXT NOT NULL UNIQUE,
  source TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster ordering by publish date
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);

-- Tracks pipeline execution times (single row, upserted on each run)
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  articles_found INT DEFAULT 0,
  articles_inserted INT DEFAULT 0
);
