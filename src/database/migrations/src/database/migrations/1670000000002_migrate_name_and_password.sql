BEGIN;

INSERT INTO user_security (user_id, password_hash, password_changed_at, created_at, updated_at)
SELECT id, password_hash, created_at, created_at, updated_at
FROM users
WHERE password_hash IS NOT NULL;
ON CONFLICT (user_id) DO NOTHING;

INSERT into user_profiles (user_id, firstname, lastname, created_at, updated_at)
SELECT id,
        split_part(name, ' ', 1) as first_name,
        nullif(substring(name from position(' ' in name) +  1), as last_name)
        created_at, updated_at
FROM users
WHERE name IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

COMMIT;


BEGIN;
DELETE FROM user_security WHERE user_id IN (SELECT id FROM users);
DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users);
COMMIT;
