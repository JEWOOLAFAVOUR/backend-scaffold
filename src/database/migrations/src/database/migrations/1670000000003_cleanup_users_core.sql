BEGIN;

-- add recommended core columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- index phone for fast lookup (nullable)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

COMMIT;

BEGIN;
DROP INDEX IF EXISTS idx_users_phone;
ALTER TABLE users
  DROP COLUMN IF EXISTS phone_number,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS email_verified_at,
  DROP COLUMN IF EXISTS phone_verified_at,
  DROP COLUMN IF EXISTS last_login_at,
  DROP COLUMN IF EXISTS deleted_at;
COMMIT;