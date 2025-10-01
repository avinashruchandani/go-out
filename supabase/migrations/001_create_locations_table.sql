-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for categories
CREATE TYPE location_category AS ENUM (
  'restaurant',
  'cafe',
  'bar',
  'nightclub',
  'cinema',
  'theater',
  'shopping_mall',
  'park',
  'art_studio',
  'art_gallery',
  'amusement_park',
  'arcade',
  'bowling',
  'go_kart',
  'climbing_gym',
  'museum',
  'cultural_center',
  'water_park',
  'escape_room',
  'dance_school',
  'music_school',
  'cooking_class',
  'concert_hall',
  'rooftop_lounge',
  'convention_center',
  'exhibition_center',
  'resort',
  'country_club',
  'community_center'
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  category location_category NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  picture_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for geospatial queries
CREATE INDEX idx_locations_lat_lng ON locations (lat, lng);
CREATE INDEX idx_locations_category ON locations (category);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Locations are viewable by everyone" 
  ON locations FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert locations" 
  ON locations FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create policy for authenticated users to update their own entries
CREATE POLICY "Authenticated users can update locations" 
  ON locations FOR UPDATE 
  TO authenticated 
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locations_updated_at 
  BEFORE UPDATE ON locations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
