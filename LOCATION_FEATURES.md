# Location Detail & Favorites Feature

## Overview

This feature allows users to view detailed information about locations and save their favorites with personal notes.

---

## Features

### 1. Location Detail Modal

**Trigger:** Click on any map marker

**Contents:**
- 📍 **Location Name** (with category emoji)
- 🗺️ **Address**
- 🖼️ **Picture** (if available from OSM)
- 🏷️ **Category Badge** (with emoji)
- 📌 **Coordinates** (for reference)

**User-Specific Features (Logged In):**
- ❤️ **Favorite Button** (toggle on/off)
- 📝 **Personal Notes** (auto-save)

**Guest Users:**
- Prompt to log in to access favorites

---

### 2. Database Structure

#### `locations` Table

```typescript
{
  id: UUID,              // Unique identifier
  name: string,          // Location name
  address: string,       // Full address
  category: enum,        // One of 29 categories
  lat: number,           // Latitude (double precision)
  lng: number,           // Longitude (double precision)
  picture_link: string,  // Optional image URL
  created_at: timestamp,
  updated_at: timestamp
}
```

**Policies:**
- ✅ Public can SELECT (read)
- ✅ Authenticated users can INSERT
- ✅ Authenticated users can UPDATE

#### `user_favourites` Table

```typescript
{
  id: UUID,              // Unique identifier
  user_id: UUID,         // References auth.users
  location_id: UUID,     // References locations
  notes: string,         // User's personal notes
  created_at: timestamp,
  updated_at: timestamp,
  
  // Unique constraint: (user_id, location_id)
}
```

**Policies:**
- ✅ Users can only see their own favorites
- ✅ Users can only modify their own favorites
- ✅ UNIQUE constraint prevents duplicate favorites

---

### 3. Server Actions

Located in: `lib/actions/favorites.ts`

#### `getOrCreateLocation(locationData)`
- Checks if location exists by coordinates
- Creates new location if not found
- Returns the location from database

#### `checkFavorite(locationId)`
- Checks if current user has favorited a location
- Returns favorite record with notes

#### `toggleFavorite(locationId)`
- Adds/removes location from user's favorites
- Returns new favorite status

#### `updateFavoriteNotes(locationId, notes)`
- Updates user's notes for a favorited location
- Auto-called 1 second after user stops typing

---

### 4. User Flow

#### For Guests (Not Logged In)

```
1. User clicks marker on map
2. Modal opens showing location details
3. Bottom shows "Log in to add to favorites" message
4. No favorite button or notes shown
```

#### For Logged-In Users

**First Visit to Location:**
```
1. User clicks marker
2. Modal opens, location saved to DB if new
3. "Add to Favorites" button shown (outline style)
4. No notes section visible
```

**After Adding to Favorites:**
```
1. Button changes to "Favorited" (filled style)
2. Heart icon fills in
3. Notes section appears below
4. User can type personal notes
5. Notes auto-save after 1 second
6. "Saving..." → "✓ Saved" indicator
```

**Removing from Favorites:**
```
1. Click "Favorited" button again
2. Button returns to "Add to Favorites"
3. Notes section disappears
4. Notes are deleted from database
```

---

### 5. Auto-Save Implementation

**Notes Auto-Save:**
- Triggers 1 second after user stops typing
- Shows "Saving..." while in progress
- Shows "✓ Saved" when complete
- Uses React `useEffect` with debounce
- Only saves if notes changed

```typescript
useEffect(() => {
  if (!isFavorite || notes === savedNotes) return;
  
  const timeoutId = setTimeout(() => {
    handleSaveNotes();
  }, 1000);
  
  return () => clearTimeout(timeoutId);
}, [notes, isFavorite, savedNotes]);
```

---

### 6. Modal Components

**Technology Stack:**
- **Dialog:** Radix UI + shadcn/ui
- **Textarea:** shadcn/ui
- **Transitions:** React useTransition
- **State Management:** React useState

**Key Features:**
- ✅ Responsive (max 90vh height)
- ✅ Scrollable content
- ✅ Click outside to close
- ✅ ESC key to close
- ✅ Loading states
- ✅ Error handling
- ✅ Optimistic UI updates

---

### 7. Data Synchronization

**Location Creation:**
1. User clicks marker (OSM data)
2. Modal opens and checks if location exists in DB
3. If not exists: creates new record
4. Uses coordinates (lat/lng) for duplicate detection

**Why This Approach?**
- OSM data is dynamic; we don't want to import everything
- Only save locations users interact with
- Efficient storage
- Always fresh data from OSM

**Trade-offs:**
- ✅ Pro: Minimal database storage
- ✅ Pro: Always up-to-date from OSM
- ⚠️ Con: Slight delay on first click
- ⚠️ Con: Same location might have different IDs

---

### 8. Security Considerations

**Row Level Security (RLS):**
- ✅ Users can ONLY see their own favorites
- ✅ Users can ONLY modify their own favorites
- ✅ SQL injection prevented by Supabase client
- ✅ User ID from auth token (server-side)

**Input Sanitization:**
- ✅ Notes are stored as plain text
- ✅ React escapes HTML automatically
- ✅ Max length enforced by Textarea

**Authentication:**
- ✅ Server actions check `auth.getUser()`
- ✅ Anonymous users see login prompt
- ✅ No sensitive data exposed to guests

---

### 9. UI/UX Details

**Modal Design:**
- **Max Width:** 2xl (672px)
- **Max Height:** 90vh (scrollable)
- **Close Button:** Top-right X
- **Background:** Semi-transparent overlay

**Favorite Button:**
- **Default State:** Outline, empty heart
- **Favorited State:** Filled background, filled heart
- **Colors:** Primary theme color
- **Transitions:** Smooth state changes

**Notes Textarea:**
- **Min Height:** 80px (4 rows)
- **Placeholder:** "Add your personal notes..."
- **Save Indicator:** Top-right of label
- **States:** Saving... / ✓ Saved

**Category Badge:**
- **Style:** Rounded pill
- **Background:** Primary/10 opacity
- **Text:** Primary color
- **Contains:** Emoji + Label

---

### 10. API Reference

#### getOrCreateLocation
```typescript
const { data, error } = await getOrCreateLocation({
  name: "McDonald's",
  address: "MG Road, Gurgaon",
  category: "restaurant",
  lat: 28.4595,
  lng: 77.0266,
  picture_link: "https://..."  // optional
});
```

#### checkFavorite
```typescript
const { data, error } = await checkFavorite(locationId);
// data = { id, user_id, location_id, notes } or null
```

#### toggleFavorite
```typescript
const { data, error } = await toggleFavorite(locationId);
// data = { isFavorite: true/false, favorite?: {...} }
```

#### updateFavoriteNotes
```typescript
const { error } = await updateFavoriteNotes(
  locationId, 
  "Great place! Try the coffee."
);
```

---

### 11. Setup Instructions

#### Step 1: Run Database Migrations

**Option A: Supabase Dashboard**
1. Go to SQL Editor
2. Run `supabase/migrations/001_create_locations_table.sql`
3. Run `supabase/migrations/002_create_user_favourites_table.sql`

**Option B: Supabase CLI**
```bash
supabase db push
```

#### Step 2: Verify Tables

1. Go to **Table Editor** in Supabase Dashboard
2. Confirm both tables exist:
   - `locations`
   - `user_favourites`
3. Check RLS is enabled (green shield icon)

#### Step 3: Test

1. Click any marker on the map
2. Modal should open
3. If logged in, favorite button appears
4. Add to favorites
5. Type notes
6. See auto-save indicator

---

### 12. Testing Checklist

**Guest Users:**
- [ ] Click marker opens modal
- [ ] Location details display correctly
- [ ] "Log in" message shows at bottom
- [ ] No favorite button visible
- [ ] No notes section visible

**Logged-In Users:**
- [ ] Click marker opens modal
- [ ] "Add to Favorites" button appears
- [ ] Click favorite button toggles state
- [ ] Notes section appears when favorited
- [ ] Typing in notes triggers auto-save
- [ ] "Saving..." indicator shows
- [ ] "✓ Saved" shows after save
- [ ] Unfavorite removes notes section
- [ ] Favorite persists after page reload

**Database:**
- [ ] Location created on first view
- [ ] Duplicate location not created
- [ ] Favorite record created/deleted
- [ ] Notes saved correctly
- [ ] User can only see own favorites

---

### 13. Common Issues

**Issue:** Location not saving to database
- **Check:** Supabase credentials in `.env.local`
- **Check:** RLS policies are correct
- **Check:** User is authenticated

**Issue:** Favorites not showing after reload
- **Check:** Database migration ran successfully
- **Check:** RLS policies allow user to read own favorites
- **Check:** Browser console for errors

**Issue:** Notes not auto-saving
- **Check:** User is favorited the location first
- **Check:** Wait 1 second after typing
- **Check:** Network tab shows update request

**Issue:** Modal not opening
- **Check:** Dialog component installed
- **Check:** No console errors
- **Check:** Marker click handler attached

---

### 14. Future Enhancements

**Planned:**
- [ ] Upload custom location photos
- [ ] Share favorites with friends
- [ ] Create favorite lists/collections
- [ ] Export favorites to Google Maps
- [ ] Add ratings/reviews
- [ ] Search favorites
- [ ] Add tags to favorites
- [ ] Favorite statistics/insights

**Possible Integrations:**
- [ ] Google Places API for photos
- [ ] Foursquare/Yelp for reviews
- [ ] Instagram location photos
- [ ] OpenAI for smart note suggestions

---

### 15. Performance Considerations

**Optimizations:**
- ✅ Location lookup by coordinates (indexed)
- ✅ Debounced auto-save (prevents spam)
- ✅ Optimistic UI updates
- ✅ React useTransition for smooth UX
- ✅ Lazy loading of modal content

**Database Indexes:**
- `locations(lat, lng)` - Geospatial queries
- `locations(category)` - Category filtering
- `user_favourites(user_id)` - User lookups
- `user_favourites(location_id)` - Location lookups

**Caching Strategy:**
- Modal state: React component state
- Favorites: Fetched on modal open
- Notes: Auto-saved to DB
- Locations: Created once, cached in DB

---

## Summary

This feature provides a complete favorites system with:
- ✅ Click markers to view details
- ✅ Save favorite locations
- ✅ Add personal notes
- ✅ Auto-save functionality
- ✅ User-specific data with RLS
- ✅ Responsive modal UI
- ✅ Guest user support

Perfect for building a personalized "go-out" experience! 🎉
