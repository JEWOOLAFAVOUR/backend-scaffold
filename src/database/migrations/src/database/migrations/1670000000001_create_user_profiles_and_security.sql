-- Up

BEGIN;

-- user_profiles
CREATE TABLE IF NOT EXISTS user_profiles(
    user_id BIGINT PRIMARY KEY REFERENCES user(id) ON DELETE CASCASDE,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- user_security
CREATE TABLE IF NOT EXISTS user_security {
    user_id BIGINT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    password_changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false, 
    failed_login_count INTEGER NOT NULL DEFAULT 0, 
    locked_until TIMESTAMP WITH TIME ZONE,
    create_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
};

COMMIT;

-- Down 
BEGIN;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS user_security;
COMMIT;