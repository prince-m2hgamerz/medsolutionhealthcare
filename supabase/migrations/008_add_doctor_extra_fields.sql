-- Add extra doctor fields that exist in the Doctor interface
-- but are missing from the database schema.

ALTER TABLE doctors ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS telephone TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS profile_url TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS appointment_url TEXT;

-- Also ensure hospitals table has the right logo_url type (TEXT is already the case)
-- and add logo_overridden for proper reading by public page
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS logo_overridden BOOLEAN DEFAULT FALSE;
