'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MapPin } from 'lucide-react';
import { Location, CATEGORY_INFO } from '@/lib/map-data';
import {
  getOrCreateLocation,
  checkFavorite,
  toggleFavorite,
  updateFavoriteNotes,
} from '@/lib/actions/favorites';
import { createClient } from '@/lib/supabase/client';

interface LocationDetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteChange?: () => void;
}

export function LocationDetailModal({
  location,
  isOpen,
  onClose,
  onFavoriteChange,
}: LocationDetailModalProps) {
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [locationId, setLocationId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Initialize location data and check favorite status
  useEffect(() => {
    if (!location || !isOpen) {
      setLocationId(null);
      setIsFavorite(false);
      setNotes('');
      setSavedNotes('');
      return;
    }

    const initializeLocation = async () => {
      // Get or create location in database
      const { data: dbLocation } = await getOrCreateLocation({
        name: location.name,
        address: location.address || 'Address not available',
        category: location.category,
        lat: location.lat,
        lng: location.lng,
        picture_link: location.picture_link,
      });

      if (dbLocation) {
        setLocationId(dbLocation.id);

        // Check if favorited
        if (user) {
          const { data: favorite } = await checkFavorite(dbLocation.id);
          if (favorite) {
            setIsFavorite(true);
            setNotes(favorite.notes || '');
            setSavedNotes(favorite.notes || '');
          } else {
            setIsFavorite(false);
            setNotes('');
            setSavedNotes('');
          }
        }
      }
    };

    initializeLocation();
  }, [location, isOpen, user]);

  const handleToggleFavorite = () => {
    if (!locationId) return;

    startTransition(async () => {
      const { data, error } = await toggleFavorite(locationId);
      if (!error && data) {
        setIsFavorite(data.isFavorite);
        if (!data.isFavorite) {
          setNotes('');
          setSavedNotes('');
        }
        // Notify parent to refresh favorites list
        onFavoriteChange?.();
      }
    });
  };

  const handleSaveNotes = () => {
    if (!locationId) return;

    setIsSaving(true);
    startTransition(async () => {
      const { error } = await updateFavoriteNotes(locationId, notes);
      if (!error) {
        setSavedNotes(notes);
      }
      setIsSaving(false);
    });
  };

  // Auto-save notes after 1 second of no typing
  useEffect(() => {
    if (!isFavorite || notes === savedNotes) return;

    const timeoutId = setTimeout(() => {
      handleSaveNotes();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, isFavorite, savedNotes]);

  if (!location) return null;

  const categoryInfo = CATEGORY_INFO[location.category];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <span className="text-3xl">{categoryInfo.emoji}</span>
            {location.name}
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-base">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <span>{location.address || 'Address not available'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Picture */}
          {location.picture_link && (
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={location.picture_link}
                alt={location.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
              {categoryInfo.emoji} {categoryInfo.label}
            </span>
          </div>

          {/* Coordinates (for debugging/reference) */}
          <div className="text-xs text-gray-500">
            Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>

          {/* User-specific features */}
          {user ? (
            <div className="border-t pt-4 space-y-4">
              {/* Favorite Button */}
              <div>
                <Button
                  onClick={handleToggleFavorite}
                  disabled={isPending}
                  variant={isFavorite ? 'default' : 'outline'}
                  className="w-full sm:w-auto"
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${
                      isFavorite ? 'fill-current' : ''
                    }`}
                  />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>

              {/* Notes Section (only show if favorited) */}
              {isFavorite && (
                <div className="space-y-2">
                  <label
                    htmlFor="notes"
                    className="text-sm font-medium flex items-center justify-between"
                  >
                    <span>Personal Notes</span>
                    {notes !== savedNotes && (
                      <span className="text-xs text-gray-500">Saving...</span>
                    )}
                    {notes === savedNotes && notes && (
                      <span className="text-xs text-green-600">✓ Saved</span>
                    )}
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Add your personal notes about this location..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    disabled={isSaving}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <a href="/login" className="text-primary hover:underline">
                  Log in
                </a>{' '}
                to add this location to your favorites and add personal notes.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
