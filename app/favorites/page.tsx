import { createClient } from '@/lib/supabase/server';
import { getUserFavorites } from '@/lib/actions/favorites';
import { redirect } from 'next/navigation';
import { CATEGORY_INFO } from '@/lib/map-data';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RemoveFavoriteButton } from '@/components/remove-favorite-button';

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: favorites, error } = await getUserFavorites();

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Favorites</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
        <p className="text-gray-600">
          {favorites?.length || 0} saved location{favorites?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">
            Start exploring the map and add locations to your favorites!
          </p>
          <Button asChild>
            <a href="/">Explore Map</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite: any) => {
            const location = favorite.locations;
            if (!location) return null;

            const categoryInfo = CATEGORY_INFO[location.category as keyof typeof CATEGORY_INFO];
            const formattedDate = new Date(favorite.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-3xl">{categoryInfo?.emoji || '📍'}</span>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{location.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{location.address}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <RemoveFavoriteButton locationId={location.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Category Badge */}
                    <div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {categoryInfo?.emoji} {categoryInfo?.label}
                      </span>
                    </div>

                    {/* Notes */}
                    {favorite.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 italic">"{favorite.notes}"</p>
                      </div>
                    )}

                    {/* Date Added */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Added {formattedDate}
                    </div>

                    {/* View on Map Button */}
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <a 
                        href={`/?lat=${location.lat}&lng=${location.lng}&zoom=16`}
                        className="flex items-center justify-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        View on Map
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
