# Map Features Documentation

## Overview

The home page now features an interactive Leaflet map centered on Gurgaon with sample locations for restaurants, cinemas, and parks.

## Features Implemented

### ✅ Interactive Map
- **Provider:** OpenStreetMap tiles
- **Default Center:** Gurgaon (28.4595° N, 77.0266° E)
- **Initial Zoom:** Level 12
- **Mouse Controls:** Scroll to zoom, drag to pan

### ✅ Location Categories

#### 🍽️ Restaurants (4 locations)
- Cyber Hub Restaurants
- Kingdom of Dreams Food Court
- Galleria Market Cafes
- Ambience Mall Food Court

#### 🎬 Cinemas (3 locations)
- PVR Ambience
- INOX Sapphire
- PVR MGF Metropolitan

#### 🌳 Parks (4 locations)
- Leisure Valley Park
- Aravalli Biodiversity Park
- Tau Devi Lal Park
- Cyber City Central Park

### ✅ Category Filter Dropdown
- **Location:** Floating button on top-left corner
- **Features:**
  - Multi-select checkboxes for each category
  - Shows count of selected categories
  - "Clear All" button to reset filters
  - Real-time map updates when toggling categories
  - All categories selected by default

### ✅ Map Markers
- **Custom Emoji Icons:** Each marker uses a relevant emoji based on category
- **Interactive Popups:** Click any marker to see:
  - Location name with emoji
  - Full address
  - Category badge
- **Smart Auto-fit:** Map automatically adjusts to show all visible markers

## Technical Details

### Components Created

1. **`components/map-view.tsx`** - Main map component (client-side)
2. **`components/category-filter.tsx`** - Category filter dropdown
3. **`components/ui/checkbox.tsx`** - shadcn/ui checkbox component
4. **`lib/map-data.ts`** - Location data and category configuration

### Dependencies Added
- `leaflet` - Core mapping library
- `react-leaflet` - React wrapper for Leaflet
- `@types/leaflet` - TypeScript definitions
- `@radix-ui/react-checkbox` - Checkbox component

### Styling
- Leaflet CSS imported globally
- Custom emoji icons with shadow effects
- Responsive full-height layout

## How to Add More Locations

Edit `/Users/avinash/Projects/go-out/lib/map-data.ts`:

```typescript
export const SAMPLE_LOCATIONS: Location[] = [
  // ... existing locations
  {
    id: 'unique-id',
    name: 'Location Name',
    category: 'restaurants', // or 'cinemas' or 'parks'
    coordinates: [latitude, longitude],
    emoji: '🍽️', // Choose appropriate emoji
    address: 'Full address here',
  },
];
```

## How to Add New Categories

1. Update the `Category` type in `lib/map-data.ts`:
```typescript
export type Category = 'restaurants' | 'cinemas' | 'parks' | 'your-new-category';
```

2. Add category info:
```typescript
export const CATEGORY_INFO: Record<Category, { label: string; color: string; emoji: string }> = {
  // ... existing categories
  'your-new-category': { 
    label: 'Your Category', 
    color: '#hexcolor', 
    emoji: '🎯' 
  },
};
```

3. Add locations with the new category

## Future Enhancements Ideas

- [ ] Search bar to find specific locations
- [ ] User location detection (GPS)
- [ ] Directions/routing between locations
- [ ] User-added custom locations (requires authentication)
- [ ] Filter by distance from user
- [ ] Location reviews and ratings
- [ ] Save favorite locations
- [ ] Share locations with friends
- [ ] Real-time data from APIs (Yelp, Google Places, etc.)

## Coordinates Reference

To find coordinates for new locations:
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the location
3. Click the coordinates (they'll be copied)
4. Format: First number is latitude, second is longitude
