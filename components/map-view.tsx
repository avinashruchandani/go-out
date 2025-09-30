'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, GURGAON_CENTER, Category } from '@/lib/map-data';
import { CategoryFilter } from '@/components/category-filter';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom emoji icon with circular background
const createEmojiIcon = (emoji: string) => {
  return L.divIcon({
    html: `<div class="emoji-marker">
      <div class="emoji-marker-inner">${emoji}</div>
    </div>`,
    className: 'emoji-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface MapViewProps {
  locations: Location[];
}

function MapUpdater({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => loc.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else {
      map.setView(GURGAON_CENTER, 12);
    }
  }, [locations, map]);

  return null;
}

export function MapView({ locations: initialLocations }: MapViewProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'restaurant',
    'cafe',
  ]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [loading, setLoading] = useState(false);
  const [locationCounts, setLocationCounts] = useState<Record<Category, number>>({} as Record<Category, number>);

  // Only render map on client side
  useEffect(() => {
    try {
      console.log('MapView mounting');
      setMounted(true);
    } catch (err) {
      console.error('Error mounting map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
    }
  }, []);

  // Fetch locations when categories change
  useEffect(() => {
    if (!mounted || selectedCategories.length === 0) {
      setLocations([]);
      setLocationCounts({} as Record<Category, number>);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { fetchLocations } = await import('@/lib/overpass-api');
        const newLocations = await fetchLocations(
          selectedCategories,
          GURGAON_CENTER[0],
          GURGAON_CENTER[1],
          5000 // 5km radius
        );
        
        console.log(`Fetched ${newLocations.length} locations for categories:`, selectedCategories);
        setLocations(newLocations);
        
        // Calculate counts per category
        const counts: Record<Category, number> = {} as Record<Category, number>;
        newLocations.forEach((location) => {
          counts[location.category] = (counts[location.category] || 0) + 1;
        });
        setLocationCounts(counts);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, selectedCategories]);

  const filteredLocations = locations;

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">🗺️</div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50">
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">Error loading data</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-full w-full flex">
        <CategoryFilter
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          locationCounts={locationCounts}
          loading={loading}
        />
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute top-6 right-6 z-[1000] bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-600">Loading locations...</span>
            </div>
          )}
          <MapContainer
          center={GURGAON_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        />
          <MapUpdater locations={filteredLocations} />
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={createEmojiIcon(location.emoji)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    <span>{location.emoji}</span>
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                    {location.category}
                  </span>
                </div>
              </Popup>
          </Marker>
        ))}
      </MapContainer>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error rendering map:', err);
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50">
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">Error rendering map</p>
          <p className="text-sm text-red-500">{err instanceof Error ? err.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}
