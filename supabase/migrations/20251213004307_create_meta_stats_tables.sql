/*
  # Create Meta Statistics Tables

  ## New Tables
  
  ### meta_connections
  - `id` (uuid, primary key) - Unique identifier for the connection
  - `user_id` (uuid, foreign key) - References the user who owns this connection
  - `page_id` (text) - Facebook page ID
  - `page_name` (text) - Facebook page name
  - `access_token` (text) - Facebook access token for API calls
  - `instagram_account_id` (text, nullable) - Instagram Business account ID if linked
  - `instagram_username` (text, nullable) - Instagram username if linked
  - `created_at` (timestamptz) - When the connection was created
  - `updated_at` (timestamptz) - When the connection was last updated
  
  ### stat_reports
  - `id` (uuid, primary key) - Unique identifier for the report
  - `user_id` (uuid, foreign key) - References the user who owns this report
  - `title` (text) - Report title
  - `description` (text, nullable) - Report description
  - `connections` (text[]) - Array of connection IDs to track
  - `metrics` (text[]) - Array of metric names to collect
  - `period_type` (text) - Collection period: 'daily', 'weekly', or 'monthly'
  - `last_sync` (timestamptz) - Last time data was synchronized
  - `is_active` (boolean) - Whether the report is active
  - `created_at` (timestamptz) - When the report was created
  - `updated_at` (timestamptz) - When the report was last updated
  
  ### social_stats
  - `id` (uuid, primary key) - Unique identifier for the statistic
  - `user_id` (uuid, foreign key) - References the user who owns this stat
  - `connection_id` (uuid) - References the connection this stat belongs to
  - `platform` (text) - Platform name: 'facebook' or 'instagram'
  - `metric_name` (text) - Name of the metric
  - `metric_value` (numeric) - Value of the metric
  - `period_start` (timestamptz) - Start of the measurement period
  - `period_end` (timestamptz) - End of the measurement period
  - `data` (jsonb, nullable) - Raw data from the API
  - `created_at` (timestamptz) - When the stat was recorded

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - All tables have policies for SELECT, INSERT, UPDATE, and DELETE
  
  ## Important Notes
  1. Access tokens are sensitive - consider encryption in production
  2. Indexes added for common query patterns (user_id, platform, date ranges)
  3. Foreign key constraints ensure data integrity
*/

-- Create meta_connections table
CREATE TABLE IF NOT EXISTS meta_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id text NOT NULL,
  page_name text NOT NULL,
  access_token text NOT NULL,
  instagram_account_id text,
  instagram_username text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stat_reports table
CREATE TABLE IF NOT EXISTS stat_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  connections text[] NOT NULL DEFAULT '{}',
  metrics text[] NOT NULL DEFAULT '{}',
  period_type text NOT NULL DEFAULT 'daily',
  last_sync timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_period_type CHECK (period_type IN ('daily', 'weekly', 'monthly'))
);

-- Create social_stats table
CREATE TABLE IF NOT EXISTS social_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id text NOT NULL,
  platform text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_platform CHECK (platform IN ('facebook', 'instagram'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meta_connections_user_id ON meta_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_stat_reports_user_id ON stat_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_social_stats_user_id ON social_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_social_stats_connection_id ON social_stats(connection_id);
CREATE INDEX IF NOT EXISTS idx_social_stats_platform ON social_stats(platform);
CREATE INDEX IF NOT EXISTS idx_social_stats_period ON social_stats(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE stat_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_stats ENABLE ROW LEVEL SECURITY;

-- Policies for meta_connections
CREATE POLICY "Users can view own connections"
  ON meta_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON meta_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON meta_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON meta_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for stat_reports
CREATE POLICY "Users can view own reports"
  ON stat_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON stat_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON stat_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON stat_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for social_stats
CREATE POLICY "Users can view own stats"
  ON social_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON social_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON social_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stats"
  ON social_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);