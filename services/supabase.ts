import { createClient } from '@supabase/supabase-js';
import { Listing, User } from '../types';

// Use import.meta.env to access Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// --- CONNECTION LOGIC ---

// Check if keys are physically present
export const hasSupabaseKeys = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_project_url') &&
  !supabaseUrl.includes('placeholder')
);

// Check if simulation is manually forced by the user/stakeholder
export const isSimulationForced = () => {
  return sessionStorage.getItem('TIMBER_FORCE_SIMULATION') === 'true';
};

// The effective connection status
export const isSupabaseConnected = hasSupabaseKeys && !isSimulationForced();

export const toggleForcedSimulation = (force: boolean) => {
  sessionStorage.setItem('TIMBER_FORCE_SIMULATION', force ? 'true' : 'false');
  window.location.reload(); // Reload to re-initialize the client and auth listeners
};

export const supabase = isSupabaseConnected 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- SIMULATION PERSISTENCE (Browser LocalStorage) ---
const LOCAL_LISTINGS_KEY = 'timber_sim_listings';
const LOCAL_USER_KEY = 'timber_sim_user';

export const saveSimulatedUser = (user: User | null) => {
  if (user) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(LOCAL_USER_KEY);
};

export const getSimulatedUser = (): User | null => {
  try {
    const data = localStorage.getItem(LOCAL_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

export const saveSimulatedListing = (listing: Listing) => {
  const existing = getSimulatedListings();
  if (existing.some(l => l.id === listing.id)) return;
  localStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify([listing, ...existing]));
};

export const getSimulatedListings = (): Listing[] => {
  try {
    const data = localStorage.getItem(LOCAL_LISTINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

// --- API METHODS ---

export const fetchListings = async (): Promise<Listing[]> => {
  const localItems = getSimulatedListings();
  
  if (!isSupabaseConnected) return localItems;

  try {
    const { data, error } = await supabase!
      .from('listings')
      .select('*, landowner:profiles!landowner_id(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const remoteItems = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      location: item.location,
      pricePerDay: item.price_per_day,
      description: item.description,
      gameTypes: item.game_types || [],
      sportingArms: item.sporting_arms || [],
      acreage: item.acreage || 0,
      features: item.features || [],
      accommodations: item.accommodations || [],
      images: item.images?.length ? item.images : [`https://picsum.photos/seed/${item.id}/800/600`],
      isVerified: item.is_verified,
      coordinates: item.coordinates,
      landowner: {
          id: item.landowner_id || 'unknown',
          name: item.landowner?.full_name || "Verified Landowner",
          avatar: item.landowner?.avatar_url || `https://picsum.photos/seed/${item.landowner_id}/100/100`,
          rating: 5.0,
          listingsCount: 1
      },
      rating: 5.0,
      reviews: 0
    }));

    return [...localItems, ...remoteItems];
  } catch (err) {
    console.warn('Live DB connection failed.', err);
    return localItems;
  }
};

export const insertListing = async (listing: Partial<Listing>, userId: string) => {
  if (!isSupabaseConnected || userId.startsWith('mock-')) {
    const newListing = {
      ...listing,
      id: 'local-' + Math.random().toString(36).substr(2, 9),
      landowner: {
        id: userId,
        name: "Local User",
        avatar: `https://picsum.photos/seed/${userId}/100/100`,
        rating: 5.0,
        listingsCount: 1
      }
    } as Listing;
    saveSimulatedListing(newListing);
    return { data: [newListing], error: null };
  }

  return await supabase!
    .from('listings')
    .insert([{
      title: listing.title,
      location: listing.location,
      price_per_day: listing.pricePerDay,
      description: listing.description,
      game_types: listing.gameTypes,
      sporting_arms: listing.sportingArms,
      acreage: listing.acreage,
      features: listing.features,
      accommodations: listing.accommodations,
      images: listing.images,
      landowner_id: userId,
      coordinates: listing.coordinates || { lat: 39.8, lng: -98.5 }
    }])
    .select();
};

// --- MESSAGING ---

export const fetchUserMessages = async (userId: string) => {
  if (!isSupabaseConnected) return [];

  const { data, error } = await supabase!
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id(full_name, avatar_url),
      receiver:profiles!receiver_id(full_name, avatar_url),
      listing:listings(title)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data;
};

export const sendMessage = async (listingId: string, senderId: string, receiverId: string, content: string) => {
  if (!isSupabaseConnected) return { data: null, error: null };

  return await supabase!
    .from('messages')
    .insert([{
      listing_id: listingId,
      sender_id: senderId,
      receiver_id: receiverId,
      content
    }])
    .select();
};

// --- AUTH & USER ---

export const updateUserRole = async (role: 'hunter' | 'landowner' | 'admin') => {
  if (!isSupabaseConnected) return { data: null, error: null };
  
  // 1. Update Auth Metadata (for session)
  await supabase!.auth.updateUser({
    data: { role, is_onboarded: true }
  });

  // 2. Update Public Profile (for database relations)
  return await supabase!.from('profiles').update({ role }).eq('id', (await supabase!.auth.getUser()).data.user?.id);
};

export const signInWithGoogle = async () => {
  if (!isSupabaseConnected) return { error: { message: "Supabase not configured" } };
  return await supabase!.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
};

export const signOut = async () => {
  saveSimulatedUser(null);
  if (isSupabaseConnected) await supabase!.auth.signOut();
};