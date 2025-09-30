import { Location, Category, OSM_TAG_MAPPING } from './map-data';

// Overpass API endpoint
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    amenity?: string;
    leisure?: string;
    shop?: string;
    tourism?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * Build Overpass QL query for a specific category
 */
function buildOverpassQuery(
  category: Category,
  centerLat: number,
  centerLon: number,
  radiusMeters: number = 5000
): string {
  const tags = OSM_TAG_MAPPING[category];
  if (!tags || tags.length === 0) {
    return '';
  }

  // Build the query parts for each tag
  const tagQueries = tags
    .map((tag) => {
      const [key, value] = tag.split('=');
      return `  node["${key}"="${value}"](around:${radiusMeters},${centerLat},${centerLon});
  way["${key}"="${value}"](around:${radiusMeters},${centerLat},${centerLon});`;
    })
    .join('\n');

  return `[out:json][timeout:25];
(
${tagQueries}
);
out center;`;
}

// Add delay between requests to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch locations for a specific category from Overpass API
 */
export async function fetchCategoryLocations(
  category: Category,
  centerLat: number,
  centerLon: number,
  radiusMeters: number = 5000
): Promise<Location[]> {
  const query = buildOverpassQuery(category, centerLat, centerLon, radiusMeters);
  
  if (!query) {
    console.warn(`No OSM tags defined for category: ${category}`);
    return [];
  }

  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limit hit for ${category}, skipping...`);
        return [];
      }
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    
    return data.elements
      .filter((element) => {
        // Filter elements that have coordinates and a name
        const hasCoords = element.lat !== undefined || element.center !== undefined;
        const hasName = element.tags?.name !== undefined;
        return hasCoords && hasName;
      })
      .map((element) => {
        const lat = element.lat || element.center?.lat || 0;
        const lon = element.lon || element.center?.lon || 0;
        const tags = element.tags!;
        
        // Build address from available tags
        const addressParts = [
          tags['addr:housenumber'],
          tags['addr:street'],
          tags['addr:city'],
        ].filter(Boolean);
        
        const address = addressParts.length > 0 
          ? addressParts.join(', ')
          : 'Gurgaon, Haryana';

        return {
          id: `${category}-${element.id}`,
          name: tags.name!,
          category,
          coordinates: [lat, lon] as [number, number],
          emoji: getCategoryEmoji(category),
          address,
        };
      });
  } catch (error) {
    console.error(`Error fetching ${category} from Overpass API:`, error);
    return [];
  }
}

/**
 * Fetch locations for multiple categories with rate limiting
 */
export async function fetchLocations(
  categories: Category[],
  centerLat: number,
  centerLon: number,
  radiusMeters: number = 5000
): Promise<Location[]> {
  try {
    const results: Location[] = [];
    
    // Fetch categories sequentially with delay to avoid rate limiting
    // Process in batches of 3 to balance speed and rate limits
    const batchSize = 3;
    for (let i = 0; i < categories.length; i += batchSize) {
      const batch = categories.slice(i, i + batchSize);
      
      // Fetch batch in parallel
      const batchResults = await Promise.all(
        batch.map(async (category, index) => {
          // Add small delay between requests in the same batch
          if (index > 0) {
            await delay(300); // 300ms delay
          }
          return fetchCategoryLocations(category, centerLat, centerLon, radiusMeters);
        })
      );
      
      results.push(...batchResults.flat());
      
      // Wait between batches
      if (i + batchSize < categories.length) {
        await delay(1000); // 1 second between batches
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

/**
 * Get emoji for a category
 */
function getCategoryEmoji(category: Category): string {
  const emojiMap: Record<Category, string> = {
    restaurant: '🍽️',
    cafe: '☕',
    bar: '🍺',
    nightclub: '🎉',
    cinema: '🎬',
    theater: '🎭',
    shopping_mall: '🛍️',
    park: '🌳',
    art_studio: '🎨',
    art_gallery: '🖼️',
    amusement_park: '🎢',
    arcade: '🕹️',
    bowling: '🎳',
    go_kart: '🏎️',
    climbing_gym: '🧗',
    museum: '🏛️',
    cultural_center: '🎪',
    water_park: '🏊',
    escape_room: '🔐',
    dance_school: '💃',
    music_school: '🎵',
    cooking_class: '👨‍🍳',
    concert_hall: '🎼',
    rooftop_lounge: '🌆',
    convention_center: '🏢',
    exhibition_center: '🎨',
    resort: '🏖️',
    country_club: '⛳',
    community_center: '🏘️',
  };
  
  return emojiMap[category] || '📍';
}
