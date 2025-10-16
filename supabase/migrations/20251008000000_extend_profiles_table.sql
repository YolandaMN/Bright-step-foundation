-- Migration to extend the profiles table with comprehensive user profile fields
-- This adds all the fields needed for the complete user profile functionality

-- Add new columns to the existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS about_me TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
ADD COLUMN IF NOT EXISTS newsletter_subscription BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS event_updates BOOLEAN DEFAULT false;

-- Update the existing phone column name for consistency (if needed)
-- Note: We'll keep both 'phone' and use it as the main phone number

-- Add constraints for gender field
ALTER TABLE profiles 
ADD CONSTRAINT check_gender 
CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say') OR gender IS NULL);

-- Add constraints for emergency contact relationship
ALTER TABLE profiles 
ADD CONSTRAINT check_emergency_relationship 
CHECK (emergency_contact_relationship IN ('parent', 'guardian', 'spouse', 'sibling', 'friend', 'relative', 'other') OR emergency_contact_relationship IS NULL);

-- Add index for performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Enable RLS (Row Level Security) if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to manage their own profiles
DO $$
BEGIN
    -- Drop policy if it exists
    DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
    
    -- Create the policy
    CREATE POLICY "Users can manage their own profiles" ON profiles
        FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Policy already exists, ignore
END $$;