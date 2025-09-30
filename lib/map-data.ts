export type Category =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'nightclub'
  | 'cinema'
  | 'theater'
  | 'shopping_mall'
  | 'park'
  | 'art_studio'
  | 'art_gallery'
  | 'amusement_park'
  | 'arcade'
  | 'bowling'
  | 'go_kart'
  | 'climbing_gym'
  | 'museum'
  | 'cultural_center'
  | 'water_park'
  | 'escape_room'
  | 'dance_school'
  | 'music_school'
  | 'cooking_class'
  | 'concert_hall'
  | 'rooftop_lounge'
  | 'convention_center'
  | 'exhibition_center'
  | 'resort'
  | 'country_club'
  | 'community_center';

export interface Location {
  id: string;
  name: string;
  category: Category;
  coordinates: [number, number]; // [latitude, longitude]
  emoji: string;
  address: string;
}

export const GURGAON_CENTER: [number, number] = [28.4595, 77.0266];

// OpenStreetMap tag mapping for each category
export const OSM_TAG_MAPPING: Record<Category, string[]> = {
  restaurant: ['amenity=restaurant'],
  cafe: ['amenity=cafe'],
  bar: ['amenity=bar', 'amenity=pub'],
  nightclub: ['amenity=nightclub'],
  cinema: ['amenity=cinema'],
  theater: ['amenity=theatre'],
  shopping_mall: ['shop=mall', 'shop=department_store'],
  park: ['leisure=park'],
  art_studio: ['craft=painter', 'amenity=studio'],
  art_gallery: ['tourism=gallery'],
  amusement_park: ['tourism=theme_park', 'leisure=amusement_arcade'],
  arcade: ['leisure=amusement_arcade'],
  bowling: ['leisure=bowling_alley'],
  go_kart: ['sport=karting'],
  climbing_gym: ['sport=climbing'],
  museum: ['tourism=museum'],
  cultural_center: ['amenity=community_centre', 'amenity=arts_centre'],
  water_park: ['leisure=water_park'],
  escape_room: ['leisure=escape_game'],
  dance_school: ['amenity=dancing_school'],
  music_school: ['amenity=music_school'],
  cooking_class: ['amenity=cooking_school'],
  concert_hall: ['amenity=concert_hall'],
  rooftop_lounge: ['amenity=bar'],
  convention_center: ['amenity=conference_centre'],
  exhibition_center: ['amenity=exhibition_centre'],
  resort: ['tourism=resort'],
  country_club: ['leisure=golf_course'],
  community_center: ['amenity=community_centre'],
};

export const CATEGORY_INFO: Record<
  Category,
  { label: string; color: string; emoji: string; group: string }
> = {
  // Food & Drink
  restaurant: { label: 'Restaurants', color: '#ef4444', emoji: '🍽️', group: 'Food & Drink' },
  cafe: { label: 'Cafés', color: '#f59e0b', emoji: '☕', group: 'Food & Drink' },
  bar: { label: 'Bars/Pubs', color: '#f97316', emoji: '🍺', group: 'Food & Drink' },

  // Nightlife
  nightclub: { label: 'Nightclubs', color: '#8b5cf6', emoji: '🎉', group: 'Nightlife' },
  rooftop_lounge: { label: 'Rooftop Lounges', color: '#a855f7', emoji: '🌆', group: 'Nightlife' },

  // Entertainment
  cinema: { label: 'Cinemas', color: '#ec4899', emoji: '🎬', group: 'Entertainment' },
  theater: { label: 'Theaters', color: '#d946ef', emoji: '🎭', group: 'Entertainment' },
  arcade: { label: 'Arcades', color: '#06b6d4', emoji: '🕹️', group: 'Entertainment' },
  bowling: { label: 'Bowling Alleys', color: '#0ea5e9', emoji: '🎳', group: 'Entertainment' },
  escape_room: { label: 'Escape Rooms', color: '#6366f1', emoji: '🔐', group: 'Entertainment' },
  concert_hall: { label: 'Concert Halls', color: '#8b5cf6', emoji: '🎼', group: 'Entertainment' },

  // Shopping
  shopping_mall: { label: 'Shopping Malls', color: '#10b981', emoji: '🛍️', group: 'Shopping' },

  // Nature & Parks
  park: { label: 'Parks', color: '#22c55e', emoji: '🌳', group: 'Nature & Parks' },
  water_park: { label: 'Water Parks', color: '#14b8a6', emoji: '🏊', group: 'Nature & Parks' },
  amusement_park: { label: 'Amusement Parks', color: '#06b6d4', emoji: '🎢', group: 'Nature & Parks' },

  // Arts & Culture
  art_studio: { label: 'Art Studios', color: '#f472b6', emoji: '🎨', group: 'Arts & Culture' },
  art_gallery: { label: 'Art Galleries', color: '#ec4899', emoji: '🖼️', group: 'Arts & Culture' },
  museum: { label: 'Museums', color: '#a78bfa', emoji: '🏛️', group: 'Arts & Culture' },
  cultural_center: { label: 'Cultural Centers', color: '#c084fc', emoji: '🎪', group: 'Arts & Culture' },
  exhibition_center: { label: 'Exhibition Centers', color: '#d946ef', emoji: '🎨', group: 'Arts & Culture' },

  // Sports & Fitness
  go_kart: { label: 'Go Kart Tracks', color: '#f59e0b', emoji: '🏎️', group: 'Sports & Fitness' },
  climbing_gym: { label: 'Climbing Gyms', color: '#84cc16', emoji: '🧗', group: 'Sports & Fitness' },
  country_club: { label: 'Country Clubs', color: '#22c55e', emoji: '⛳', group: 'Sports & Fitness' },

  // Learning
  dance_school: { label: 'Dance Schools', color: '#ec4899', emoji: '💃', group: 'Learning' },
  music_school: { label: 'Music Schools', color: '#8b5cf6', emoji: '🎵', group: 'Learning' },
  cooking_class: { label: 'Cooking Classes', color: '#f59e0b', emoji: '👨‍🍳', group: 'Learning' },

  // Venues
  convention_center: { label: 'Convention Centers', color: '#6366f1', emoji: '🏢', group: 'Venues' },
  resort: { label: 'Resorts', color: '#14b8a6', emoji: '🏖️', group: 'Venues' },
  community_center: { label: 'Community Centers', color: '#10b981', emoji: '🏘️', group: 'Venues' },
};

// Sample locations for initial testing (can be removed once API is working)
export const SAMPLE_LOCATIONS: Location[] = [];