'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface LocationData {
  id?: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  picture_link?: string;
}

export interface FavoriteData {
  id: string;
  location_id: string;
  notes: string;
}

/**
 * Get or create a location in the database
 */
export async function getOrCreateLocation(locationData: LocationData) {
  const supabase = await createClient();

  // Try to find existing location by coordinates
  const { data: existing, error: searchError } = await supabase
    .from('locations')
    .select('*')
    .eq('lat', locationData.lat)
    .eq('lng', locationData.lng)
    .maybeSingle();

  if (searchError) {
    console.error('Error searching for location:', searchError);
    return { data: null, error: searchError };
  }

  if (existing) {
    return { data: existing, error: null };
  }

  // Create new location
  const { data: newLocation, error: insertError } = await supabase
    .from('locations')
    .insert({
      name: locationData.name,
      address: locationData.address,
      category: locationData.category,
      lat: locationData.lat,
      lng: locationData.lng,
      picture_link: locationData.picture_link,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating location:', insertError);
    return { data: null, error: insertError };
  }

  return { data: newLocation, error: null };
}

/**
 * Check if a location is favorited by the current user
 */
export async function checkFavorite(locationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('user_favourites')
    .select('*')
    .eq('user_id', user.id)
    .eq('location_id', locationId)
    .maybeSingle();

  return { data, error };
}

/**
 * Toggle favorite status for a location
 */
export async function toggleFavorite(locationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favourites')
    .select('*')
    .eq('user_id', user.id)
    .eq('location_id', locationId)
    .maybeSingle();

  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from('user_favourites')
      .delete()
      .eq('id', existing.id);

    if (error) {
      return { data: null, error };
    }

    revalidatePath('/');
    return { data: { isFavorite: false }, error: null };
  } else {
    // Add to favorites
    const { data, error } = await supabase
      .from('user_favourites')
      .insert({
        user_id: user.id,
        location_id: locationId,
        notes: '',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    revalidatePath('/');
    return { data: { isFavorite: true, favorite: data }, error: null };
  }
}

/**
 * Update notes for a favorite location
 */
export async function updateFavoriteNotes(locationId: string, notes: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error('Not authenticated') };
  }

  const { error } = await supabase
    .from('user_favourites')
    .update({ notes })
    .eq('user_id', user.id)
    .eq('location_id', locationId);

  if (error) {
    return { error };
  }

  revalidatePath('/');
  revalidatePath('/favorites');
  return { error: null };
}

/**
 * Get all favorites for the current user with location details
 */
export async function getUserFavorites() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('user_favourites')
    .select(`
      id,
      notes,
      created_at,
      location_id,
      locations (
        id,
        name,
        address,
        category,
        lat,
        lng,
        picture_link
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return { data: null, error };
  }

  return { data, error: null };
}
