# OpenStreetMap Integration

## Overview

The app now fetches real-time location data from OpenStreetMap using the Overpass API instead of using hardcoded sample data.

## Features Implemented

### ✅ Live Data Fetching
- **API:** Overpass API (OpenStreetMap's query interface)
- **Radius:** 5km around Gurgaon center (28.4595° N, 77.0266° E)
- **Auto-refresh:** Data fetches when categories are selected/deselected
- **Loading indicator:** Shows in top-right while fetching

### ✅ 29 Categories Across 9 Groups

#### 🍽️ Food & Drink (3)
- Restaurants (`amenity=restaurant`)
- Cafés (`amenity=cafe`)
- Bars/Pubs (`amenity=bar`, `amenity=pub`)

#### 🎉 Nightlife (2)
- Nightclubs (`amenity=nightclub`)
- Rooftop Lounges (`amenity=bar`)

#### 🎬 Entertainment (6)
- Cinemas (`amenity=cinema`)
- Theaters (`amenity=theatre`)
- Arcades (`leisure=amusement_arcade`)
- Bowling Alleys (`leisure=bowling_alley`)
- Escape Rooms (`leisure=escape_game`)
- Concert Halls (`amenity=concert_hall`)

#### 🛍️ Shopping (1)
- Shopping Malls (`shop=mall`, `shop=department_store`)

#### 🌳 Nature & Parks (3)
- Parks (`leisure=park`)
- Water Parks (`leisure=water_park`)
- Amusement Parks (`tourism=theme_park`)

#### 🎨 Arts & Culture (5)
- Art Studios (`craft=painter`, `amenity=studio`)
- Art Galleries (`tourism=gallery`)
- Museums (`tourism=museum`)
- Cultural Centers (`amenity=community_centre`, `amenity=arts_centre`)
- Exhibition Centers (`amenity=exhibition_centre`)

#### 🏃 Sports & Fitness (3)
- Go Kart Tracks (`sport=karting`)
- Climbing Gyms (`sport=climbing`)
- Country Clubs (`leisure=golf_course`)

#### 📚 Learning (3)
- Dance Schools (`amenity=dancing_school`)
- Music Schools (`amenity=music_school`)
- Cooking Classes (`amenity=cooking_school`)

#### 🏢 Venues (3)
- Convention Centers (`amenity=conference_centre`)
- Resorts (`tourism=resort`)
- Community Centers (`amenity=community_centre`)

### ✅ Improved Category Filter
- **Grouped by category** - Easy to find related places
- **Select All / Clear All** buttons
- **Scrollable dropdown** - All 29 categories visible
- **Badge counter** - Shows selected count
- **Moved below zoom controls** - No overlap

### ✅ Smart Features
- **Parallel fetching** - All selected categories fetch simultaneously
- **Error handling** - Graceful fallback if API fails
- **Loading states** - Visual feedback during data fetch
- **Address parsing** - Uses OSM address tags when available
- **Name filtering** - Only shows locations with names

## How It Works

### 1. Category Selection
User selects categories from the filter dropdown.

### 2. Overpass Query
For each category, we build an Overpass QL query:
```
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:5000,28.4595,77.0266);
  way["amenity"="restaurant"](around:5000,28.4595,77.0266);
);
out center;
```

### 3. Data Fetching
- Queries sent to `https://overpass-api.de/api/interpreter`
- Results parsed and filtered (must have name + coordinates)
- Multiple categories fetched in parallel

### 4. Map Display
- Markers placed at exact OSM coordinates
- Custom emoji icons for each category
- Popups show name, address, and category

## API Rate Limits

**Overpass API** (free, no API key needed):
- Timeout: 25 seconds per query
- Concurrent requests: Limited (we use parallel batching)
- Fair use policy applies

**Best Practices:**
- Only fetch when categories change (not on every map move)
- Use reasonable radius (5km)
- Cache results in state

## Files Structure

```
lib/
├── map-data.ts           # Category definitions & OSM tag mapping
├── overpass-api.ts       # Overpass API service
└── utils.ts              # Helper functions

components/
├── map-view.tsx          # Main map with live data fetching
├── category-filter.tsx   # Grouped category selector
└── map-wrapper.tsx       # Client-side wrapper
```

## OpenStreetMap Tags Reference

All tags follow OpenStreetMap tagging standards:
- `amenity=*` - General facilities
- `leisure=*` - Recreational facilities
- `shop=*` - Retail establishments
- `tourism=*` - Tourist attractions
- `sport=*` - Sports facilities
- `craft=*` - Craft workshops

Full tag reference: https://wiki.openstreetmap.org/wiki/Map_features

## Extending Categories

To add a new category:

1. **Add to `Category` type** in `lib/map-data.ts`
2. **Add OSM tags** to `OSM_TAG_MAPPING`
3. **Add category info** to `CATEGORY_INFO` (label, emoji, color, group)
4. **Add emoji** to `getCategoryEmoji()` in `lib/overpass-api.ts`

Example:
```typescript
// 1. Add type
export type Category = 'restaurant' | 'your_new_category';

// 2. Add OSM tags
export const OSM_TAG_MAPPING: Record<Category, string[]> = {
  your_new_category: ['amenity=your_tag', 'leisure=alternative_tag'],
};

// 3. Add info
export const CATEGORY_INFO = {
  your_new_category: { 
    label: 'Your Category', 
    emoji: '🎯', 
    color: '#hexcode',
    group: 'Your Group'
  },
};
```

## Known Limitations

1. **Data Coverage:** Depends on OSM contributors in the area
2. **Update Frequency:** OSM data updates when contributors edit
3. **API Timeout:** Large radius or many categories may timeout
4. **No Authentication:** Public API, shared rate limits

## Future Enhancements

- [ ] Cache results locally (IndexedDB)
- [ ] Search within results
- [ ] User location-based center
- [ ] Adjust radius dynamically
- [ ] Save favorite locations
- [ ] User contributions to OSM
- [ ] Offline map support
- [ ] Alternative data sources (Google Places, Foursquare)
