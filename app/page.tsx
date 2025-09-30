import { MapWrapper } from '@/components/map-wrapper';
import { SAMPLE_LOCATIONS } from '@/lib/map-data';

export default function Home() {
  return (
    <main className="h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute inset-0">
        <MapWrapper locations={SAMPLE_LOCATIONS} />
      </div>
    </main>
  );
}