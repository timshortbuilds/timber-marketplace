export interface Landowner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  listingsCount: number;
}

export interface Listing {
  id: string;
  title: string;
  location: string;
  pricePerDay: number;
  description: string;
  gameTypes: string[];
  sportingArms: string[]; // New: Permitted sporting arms
  acreage: number;
  features: string[];
  accommodations: string[];
  images: string[];
  landowner: Landowner;
  rating: number;
  reviews: number;
  isVerified?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type UserRole = 'landowner' | 'hunter' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isMember?: boolean; // Only relevant for hunters
  isAdmin?: boolean;  // Quick check for admin privileges
}

export interface SearchFilters {
  query: string;
  location: string;
  gameTypes: string[];
  accommodations: string[];
  sportingArms: string[]; // New: Filter by sporting arms
  startDate: Date | null;
  endDate: Date | null;
  minAcreage: number;
  maxAcreage: number;
  radius: number; 
  minPrice: number;
  maxPrice: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participants: {
    hunterId: string;
    landownerId: string;
    hunterName: string;
    landownerName: string;
    landownerAvatar: string;
  };
  listingId: string;
  listingTitle: string;
  lastMessage?: string;
  messages: Message[];
}

// Admin-specific types
export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  hunterId: string;
  hunterName: string;
  landownerId: string;
  landownerName: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface RevenueMetrics {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueByProperty: { listingId: string; listingTitle: string; revenue: number }[];
  commissionEarned: number;
}

export interface UserMetrics {
  totalUsers: number;
  totalHunters: number;
  totalLandowners: number;
  totalAdmins: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsers: number;
}

export interface BookingMetrics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  popularProperties: { listingId: string; listingTitle: string; bookingCount: number }[];
  popularGameTypes: { gameType: string; count: number }[];
}