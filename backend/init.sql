-- ============================================================
-- CropAI Database Setup — Paste this in Neon SQL Editor
-- console.neon.tech → SQL Editor → paste all → Run
-- ============================================================

-- 1. Create enum type (ignore error if already exists)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  role       user_role NOT NULL DEFAULT 'user',
  location   VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location        VARCHAR(100) NOT NULL,
  temperature     DECIMAL(5,2) NOT NULL,
  rainfall        DECIMAL(7,2) NOT NULL,
  humidity        DECIMAL(5,2) NOT NULL,
  soil_type       VARCHAR(20) NOT NULL,
  crop_type       VARCHAR(20) NOT NULL,
  fertilizer      VARCHAR(20),
  area            DECIMAL(8,2),
  predicted_yield DECIMAL(10,3) NOT NULL,
  total_yield     DECIMAL(10,3),
  yield_category  VARCHAR(20),
  actual_yield    DECIMAL(10,3),
  notes           TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Hadoop logs table
CREATE TABLE IF NOT EXISTS hadoop_logs (
  id                SERIAL PRIMARY KEY,
  job_type          VARCHAR(50) NOT NULL,
  status            VARCHAR(20) NOT NULL,
  records_processed INTEGER,
  execution_time_ms INTEGER,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Verify
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
