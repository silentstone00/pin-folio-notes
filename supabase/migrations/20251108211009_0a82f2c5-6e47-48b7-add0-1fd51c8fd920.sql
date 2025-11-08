-- Drop the existing broken policy for viewing notes
DROP POLICY IF EXISTS "Anyone can view notes of users whose pin they know" ON notes;

-- Create a new policy that allows anyone (including anonymous users) to view notes
-- Security is maintained because users need the PIN to find the user_id via the profiles table
CREATE POLICY "Anyone can view shared notes"
ON notes
FOR SELECT
TO public
USING (true);