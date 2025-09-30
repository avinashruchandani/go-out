'use client';

import dynamic from 'next/dynamic';
import { Location } from '@/lib/map-data';

// Import MapView dynamically with SSR disabled (Leaflet requires window object)
const MapView = dynamic(() => import('@/components/map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-pulse text-4xl mb-4">🗺️</div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  locations: Location[];
}

export function MapWrapper({ locations }: MapWrapperProps) {
  return <MapView locations={locations} />;
}
