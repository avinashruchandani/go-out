-- Create user_favourites table
CREATE TABLE IF NOT EXISTS user_favourites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Create indexes
CREATE INDEX idx_user_favourites_user_id ON user_favourites (user_id);
CREATE INDEX idx_user_favourites_location_id ON user_favourites (location_id);

-- Enable Row Level Security
ALTER TABLE user_favourites ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own favorites
CREATE POLICY "Users can view their own favourites" 
  ON user_favourites FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own favorites
CREATE POLICY "Users can insert their own favourites" 
  ON user_favourites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own favorites
CREATE POLICY "Users can update their own favourites" 
  ON user_favourites FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own favorites
CREATE POLICY "Users can delete their own favourites" 
  ON user_favourites FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_favourites_updated_at 
  BEFORE UPDATE ON user_favourites
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
