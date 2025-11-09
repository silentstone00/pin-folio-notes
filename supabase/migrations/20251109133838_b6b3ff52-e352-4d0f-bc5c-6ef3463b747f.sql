-- Remove foreign key constraints that reference auth.users since we removed authentication
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_user_id_fkey;

-- Make sure user_id columns allow any UUID value (not just authenticated users)
-- No additional changes needed as the columns already accept UUIDs