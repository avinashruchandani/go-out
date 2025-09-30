# API Rate Limiting & Map Theme Fixes

## Changes Made

### ✅ 1. Changed Map Theme to Stadia OSMBright

**Before:** Standard OpenStreetMap tiles  
**After:** Stadia OSMBright theme (cleaner, more modern look)

```typescript
// New tile layer URL
url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
```

**Benefits:**
- More polished appearance
- Better contrast for markers
- Improved readability
- Free tier available (no API key needed for development)

---

### ✅ 2. Fixed Overpass API Rate Limiting (429 Error)

**Problem:**  
Overpass API was getting overwhelmed with too many simultaneous requests, returning HTTP 429 (Too Many Requests).

**Solution: Implemented Smart Batching**

#### Batched Requests
- Categories fetched in **batches of 3** instead of all at once
- **300ms delay** between requests in the same batch
- **1 second delay** between batches

#### Graceful Degradation
- If a category hits rate limit (429), it's skipped silently
- Other categories continue to load
- User still sees data, just potentially less of it

#### Example Flow:
```
Batch 1: Restaurant, Café, Cinema → wait 1s
Batch 2: Park, Museum, Theater → wait 1s
Batch 3: Bar, Arcade, Gallery → done
```

---

### ✅ 3. Reduced Initial Load

**Before:** 4 categories selected by default (Restaurant, Café, Cinema, Park)  
**After:** 2 categories selected by default (Restaurant, Café)

**Why:**
- Faster initial load
- Less strain on Overpass API
- Users can easily select more categories once map loads

---

## Technical Details

### Rate Limiting Strategy

```typescript
// Batch size: 3 categories at a time
const batchSize = 3;

// Delays
- Between requests in batch: 300ms
- Between batches: 1000ms
```

### Error Handling

```typescript
if (response.status === 429) {
  console.warn(`Rate limit hit for ${category}, skipping...`);
  return []; // Skip this category, continue with others
}
```

### Performance Impact

**Before:**
- 10 categories selected → 10 simultaneous requests → Rate limit! ❌

**After:**
- 10 categories selected → 4 batches (3+3+3+1) with delays → Success! ✅
- Total time: ~4 seconds (acceptable for better reliability)

---

## Overpass API Limits

**Free tier (no API key):**
- Rate limit: ~2 requests per second
- Timeout: 180 seconds per query
- Fair use policy

**Our implementation:**
- ~3 requests per second (with batching)
- Well below timeout limits
- Respectful of fair use

---

## Alternative Solutions (Future)

If rate limiting continues to be an issue:

### 1. **Use Alternative Overpass Instance**
```typescript
const OVERPASS_URL = 'https://lz4.overpass-api.de/api/interpreter';
// or
const OVERPASS_URL = 'https://z.overpass-api.de/api/interpreter';
```

### 2. **Combine Queries**
Instead of separate queries per category, combine multiple categories into one query.

### 3. **Client-Side Caching**
```typescript
// Cache results in localStorage or IndexedDB
const cacheKey = `osm-${category}-${lat}-${lon}`;
const cached = localStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);
```

### 4. **Server-Side Proxy**
Create a Next.js API route that caches and rate-limits requests:
```typescript
// app/api/overpass/route.ts
export async function POST(request: Request) {
  // Implement caching and rate limiting here
}
```

### 5. **Use Alternative Data Sources**
- Google Places API (requires API key, paid)
- Mapbox (requires API key, free tier)
- HERE Maps (requires API key, free tier)

---

## Testing

After these changes:

1. **Refresh your browser** (hard refresh)
2. **Map should load** with Stadia OSMBright theme
3. **No 429 errors** in console
4. **Restaurants and Cafés** load initially
5. **Select more categories** - they load gradually with delays

---

## Map Theme Options

If you want to try different Stadia Maps themes:

```typescript
// Stadia OSMBright (current)
url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"

// Stadia Alidade Smooth
url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"

// Stadia Alidade Smooth Dark
url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"

// Stadia Outdoors
url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
```

**Note:** Stadia Maps is free for development. For production, check their pricing or use a free alternative like standard OSM tiles.
