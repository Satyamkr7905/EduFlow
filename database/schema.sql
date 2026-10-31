-- ============================================================================
--  EduFlow CRM – PostgreSQL schema (Supabase compatible)
--  Run this once in the Supabase SQL editor, or via:  npm run db:init
--  The script is idempotent – it can be re-run safely.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- ----------------------------------------------------------------------------
--  admins
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT admins_email_unique UNIQUE (email),
  CONSTRAINT admins_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT admins_name_not_blank CHECK (length(btrim(name)) > 0)
);

-- ----------------------------------------------------------------------------
--  inquiries
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  user_type  VARCHAR(20)  NOT NULL,
  category   VARCHAR(30)  NOT NULL,
  message    TEXT         NOT NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT inquiries_name_not_blank    CHECK (length(btrim(name)) > 0),
  CONSTRAINT inquiries_email_format      CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT inquiries_phone_format      CHECK (phone ~ '^\+?[0-9][0-9 \-()]{6,18}$'),
  CONSTRAINT inquiries_message_length    CHECK (length(btrim(message)) BETWEEN 10 AND 2000),
  CONSTRAINT inquiries_user_type_check   CHECK (user_type IN ('Parent', 'Student', 'School')),
  CONSTRAINT inquiries_category_check    CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
  CONSTRAINT inquiries_status_check      CHECK (status IN ('New', 'In Progress', 'Resolved'))
);

-- Indexes used by dashboard filters, search and analytics
CREATE INDEX IF NOT EXISTS idx_inquiries_category   ON inquiries (category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type  ON inquiries (user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_updated_at ON inquiries (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_name_lower ON inquiries (lower(name));
CREATE INDEX IF NOT EXISTS idx_inquiries_phone      ON inquiries (phone);

-- ----------------------------------------------------------------------------
--  updated_at trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries;
CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

-- ----------------------------------------------------------------------------
--  Security note
--  The Express API connects with the Postgres connection string and bypasses
--  PostgREST, so Row Level Security is not required for the app to work.
--  Enabling RLS (with no policies) blocks the auto-generated Supabase REST API
--  from exposing these tables with the anon key – recommended for production.
-- ----------------------------------------------------------------------------
ALTER TABLE admins    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
