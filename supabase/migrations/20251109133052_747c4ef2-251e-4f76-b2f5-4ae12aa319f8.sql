-- Drop existing RLS policies on notes table
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
DROP POLICY IF EXISTS "Anyone can view shared notes" ON notes;

-- Create new policies that allow anyone to manage notes (for personal use without auth)
CREATE POLICY "Anyone can view all notes"
ON notes
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create notes"
ON notes
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update notes"
ON notes
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Anyone can delete notes"
ON notes
FOR DELETE
TO public
USING (true);

-- Update profiles table policies for sharing feature
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Anyone can view profiles"
ON profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can create profiles"
ON profiles
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
ON profiles
FOR UPDATE
TO public
USING (true);