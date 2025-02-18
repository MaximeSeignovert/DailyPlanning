/*
  # Create activities table for daily logs

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text, stores markdown content)
      - `date` (timestamptz, when the activity was created)
      - `created_at` (timestamptz, automatic timestamp)

  2. Security
    - Enable RLS on activities table
    - Add policies for:
      - Users can insert their own activities
      - Users can read only their own activities
*/

-- Create the activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);