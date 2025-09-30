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

// Custom emoji icon
const createEmojiIcon = (emoji: string) => {
  return L.divIcon({
    html: `<div style="font-size: 32px; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: 'emoji-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
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

export function MapView({ locations }: MapViewProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'restaurants',
    'cinemas',
    'parks',
  ]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only render map on client side
  useEffect(() => {
    try {
      console.log('MapView mounting, locations:', locations.length);
      setMounted(true);
    } catch (err) {
      console.error('Error mounting map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map');
    }
  }, [locations.length]);

  const filteredLocations = locations.filter((location) =>
    selectedCategories.includes(location.category)
  );

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50">
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">Error loading map</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-full w-full">
        <CategoryFilter
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />
        <MapContainer
          center={GURGAON_CENTER}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
