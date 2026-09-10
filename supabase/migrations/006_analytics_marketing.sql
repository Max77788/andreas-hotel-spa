-- Analytics and marketing modules for Andreas Hotel & Spa
CREATE TABLE IF NOT EXISTS andreas_website.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 80),
  page_path text NOT NULL DEFAULT '/',
  session_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON andreas_website.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON andreas_website.analytics_events (event_name);

CREATE TABLE IF NOT EXISTS andreas_website.marketing_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'organic',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','planned','active','paused','complete')),
  objective text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT '',
  start_date date,
  end_date date,
  budget_cents integer CHECK (budget_cents IS NULL OR budget_cents >= 0),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE andreas_website.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreas_website.marketing_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert_analytics" ON andreas_website.analytics_events FOR INSERT WITH CHECK (true);
