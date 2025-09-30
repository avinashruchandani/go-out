export type Category = 'restaurants' | 'cinemas' | 'parks';

export interface Location {
  id: string;
  name: string;
  category: Category;
  coordinates: [number, number]; // [latitude, longitude]
  emoji: string;
  address: string;
}

export const GURGAON_CENTER: [number, number] = [28.4595, 77.0266];

export const SAMPLE_LOCATIONS: Location[] = [
  // Restaurants
  {
    id: 'r1',
    name: 'Cyber Hub Restaurants',
    category: 'restaurants',
    coordinates: [28.4942, 77.0899],
    emoji: '🍽️',
    address: 'Cyber Hub, DLF Cyber City',
  },
  {
    id: 'r2',
    name: 'Kingdom of Dreams Food Court',
    category: 'restaurants',
    coordinates: [28.4677, 76.9942],
    emoji: '🍕',
    address: 'Sector 29, Leisure Valley Park',
  },
  {
    id: 'r3',
    name: 'Galleria Market Cafes',
    category: 'restaurants',
    coordinates: [28.4749, 77.0696],
    emoji: '☕',
    address: 'DLF Phase IV, Galleria Market',
  },
  {
    id: 'r4',
    name: 'Ambience Mall Food Court',
    category: 'restaurants',
    coordinates: [28.5006, 77.0892],
    emoji: '🍔',
    address: 'NH-8, Ambience Island',
  },
  
  // Cinemas
  {
    id: 'c1',
    name: 'PVR Ambience',
    category: 'cinemas',
    coordinates: [28.5007, 77.0890],
    emoji: '🎬',
    address: 'Ambience Mall, NH-8',
  },
  {
    id: 'c2',
    name: 'INOX Sapphire',
    category: 'cinemas',
    coordinates: [28.4422, 77.0638],
    emoji: '🎥',
    address: 'Sapphire Mall, Sector 83',
  },
  {
    id: 'c3',
    name: 'PVR MGF Metropolitan',
    category: 'cinemas',
    coordinates: [28.4824, 77.0711],
    emoji: '🍿',
    address: 'MGF Metropolitan Mall, MG Road',
  },
  
  // Parks
  {
    id: 'p1',
    name: 'Leisure Valley Park',
    category: 'parks',
    coordinates: [28.4652, 77.0329],
    emoji: '🌳',
    address: 'Sector 29',
  },
  {
    id: 'p2',
    name: 'Aravalli Biodiversity Park',
    category: 'parks',
    coordinates: [28.4215, 77.0611],
    emoji: '🦜',
    address: 'Sector 78',
  },
  {
    id: 'p3',
    name: 'Tau Devi Lal Park',
    category: 'parks',
    coordinates: [28.4734, 77.0274],
    emoji: '🏞️',
    address: 'Sector 23',
  },
  {
    id: 'p4',
    name: 'Cyber City Central Park',
    category: 'parks',
    coordinates: [28.4956, 77.0820],
    emoji: '🌺',
    address: 'DLF Cyber City',
  },
];

export const CATEGORY_INFO: Record<Category, { label: string; color: string; emoji: string }> = {
  restaurants: { label: 'Restaurants', color: '#ef4444', emoji: '🍽️' },
  cinemas: { label: 'Cinemas', color: '#8b5cf6', emoji: '🎬' },
  parks: { label: 'Parks', color: '#22c55e', emoji: '🌳' },
};
