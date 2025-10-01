# Supabase Database Setup

## Tables Created

### 1. `locations` Table
Stores information about places/locations on the map.

**Schema:**
```sql
- id: UUID (Primary Key)
- name: TEXT (Location name)
- address: TEXT (Full address)
- category: ENUM (One of 29 predefined categories)
- lat: DOUBLE PRECISION (Latitude)
- lng: DOUBLE PRECISION (Longitude)
- picture_link: TEXT (Optional URL to location image)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Indexes:**
- `idx_locations_lat_lng` - For geospatial queries
- `idx_locations_category` - For filtering by category

**RLS Policies:**
- Public can SELECT (read)
- Authenticated users can INSERT
- Authenticated users can UPDATE

---

### 2. `user_favourites` Table
Stores user's favorite locations and personal notes.

**Schema:**
```sql
- id: UUID (Primary Key)
- user_id: UUID (References auth.users)
- location_id: UUID (References locations)
- notes: TEXT (User's personal notes)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE constraint on (user_id, location_id)
```

**Indexes:**
- `idx_user_favourites_user_id` - For user lookups
- `idx_user_favourites_location_id` - For location lookups

**RLS Policies:**
- Users can only SELECT/INSERT/UPDATE/DELETE their own favorites

---

## Setup Instructions

### 1. Run Migrations

**Option A: Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `supabase/migrations/001_create_locations_table.sql`
5. Click **Run**
6. Create another new query
7. Copy the contents of `supabase/migrations/002_create_user_favourites_table.sql`
8. Click **Run**

**Option B: Supabase CLI**

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

### 2. Verify Tables

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see:
   - `locations` table
   - `user_favourites` table
3. Check that RLS is enabled (green shield icon)

---

### 3. Test Policies

**Test Read Access (Public):**
```sql
SELECT * FROM locations LIMIT 5;
```
Should work without authentication.

**Test User Favourites (Requires Auth):**
```sql
-- This should only return current user's favorites
SELECT * FROM user_favourites;
```

---

## Category Enum Values

The `location_category` enum includes:

```
restaurant, cafe, bar, nightclub, cinema, theater, 
shopping_mall, park, art_studio, art_gallery, 
amusement_park, arcade, bowling, go_kart, climbing_gym, 
museum, cultural_center, water_park, escape_room, 
dance_school, music_school, cooking_class, concert_hall, 
rooftop_lounge, convention_center, exhibition_center, 
resort, country_club, community_center
```

---

## Syncing OSM Data to Supabase

Currently, locations are fetched from OpenStreetMap Overpass API in real-time. To save them to Supabase:

### Option 1: Save on First View
When a user clicks a marker, check if location exists in Supabase. If not, create it.

### Option 2: Batch Import (Future)
Create a script to periodically fetch and sync OSM data to Supabase.

---

## Usage in App

### Fetch Location by ID
```typescript
const { data: location } = await supabase
  .from('locations')
  .select('*')
  .eq('id', locationId)
  .single();
```

### Check if Location is Favorited
```typescript
const { data: favourite } = await supabase
  .from('user_favourites')
  .select('*')
  .eq('location_id', locationId)
  .single();
```

### Add to Favorites
```typescript
const { data, error } = await supabase
  .from('user_favourites')
  .insert({
    user_id: user.id,
    location_id: locationId,
    notes: ''
  });
```

### Update Notes
```typescript
const { error } = await supabase
  .from('user_favourites')
  .update({ notes: 'My notes here' })
  .eq('user_id', user.id)
  .eq('location_id', locationId);
```

### Remove from Favorites
```typescript
const { error } = await supabase
  .from('user_favourites')
  .delete()
  .eq('user_id', user.id)
  .eq('location_id', locationId);
```

---

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled to ensure:
- Users can only modify their own favorites
- Location data is readable by everyone
- Only authenticated users can create/update locations

### Data Validation
Add constraints in application code:
- Validate latitude (-90 to 90)
- Validate longitude (-180 to 180)
- Sanitize user input for notes
- Validate picture URLs

---

## Future Enhancements

- [ ] Add `location_reviews` table for ratings/reviews
- [ ] Add `location_photos` table for user-uploaded photos
- [ ] Add `location_tags` for custom user tags
- [ ] Add full-text search on location names
- [ ] Add `opening_hours` field
- [ ] Add `phone_number` and `website` fields
- [ ] Add soft delete (deleted_at field)
- [ ] Add location ownership/creation tracking
