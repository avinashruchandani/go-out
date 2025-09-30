import { MapWrapper } from '@/components/map-wrapper';

export default function Home() {
  return (
    <main className="h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute inset-0">
        <MapWrapper locations={[]} />
      </div>
    </main>
  );
}