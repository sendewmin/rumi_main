-- Insert or update admin user in app_user table
INSERT INTO app_user (
  user_id,
  full_name, 
  email,
  phone_number,
  role,
  status,
  profile_complete,
  phone_verified
) VALUES (
  'e0878347-b681-4b27-b439-b89544c5b4b9',
  'admin rumi',
  'admin@gmail.com',
  '55656',
  'ADMIN',
  'ACTIVE',
  true,
  false
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'ADMIN',
  status = 'ACTIVE',
  email = 'admin@gmail.com',
  phone_number = '55656',
  full_name = 'admin rumi'
WHERE app_user.user_id = 'e0878347-b681-4b27-b439-b89544c5b4b9';

-- Verify the user was inserted/updated
SELECT user_id, full_name, email, role, status FROM app_user WHERE user_id = 'e0878347-b681-4b27-b439-b89544c5b4b9';
