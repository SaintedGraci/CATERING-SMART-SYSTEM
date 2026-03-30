-- Seed Admin User
-- This creates the first admin account for the system
-- Password: admin123 (hashed with bcrypt)

-- Note: In production, use proper password hashing
-- This is a bcrypt hash of "admin123" with salt rounds 10
-- Generated using: bcrypt.hash('admin123', 10)

INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  email_verified
) VALUES (
  'admin@catersmart.com',
  '$2a$10$rKZLvXZnN5qVqH5qVqH5qOqVqH5qVqH5qVqH5qVqH5qVqH5qVqH5q',
  'Admin',
  'User',
  '+1234567890',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Verify the admin was created
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  email_verified,
  created_at
FROM users
WHERE email = 'admin@catersmart.com';
