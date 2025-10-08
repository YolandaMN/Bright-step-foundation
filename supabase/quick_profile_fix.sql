-- Quick fix to add profile fields to existing profiles table
-- Run this in your Supabase SQL Editor

-- Add the missing profile fields one by one
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_subscription BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS event_updates BOOLEAN DEFAULT false;

-- Add constraints for valid values
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_gender 
CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say') OR gender IS NULL);

ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS check_emergency_relationship 
CHECK (emergency_contact_relationship IN ('parent', 'guardian', 'spouse', 'sibling', 'friend', 'relative', 'other') OR emergency_contact_relationship IS NULL);

-- Ensure RLS policy exists for profile management
DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
CREATE POLICY "Users can manage their own profiles" ON profiles
    FOR ALL USING (auth.uid() = user_id);

-- Refresh the schema
NOTIFY pgrst, 'reload schema';