import React, { useState, useEffect } from 'react';
import { User, Listing, Booking, RevenueMetrics, UserMetrics, BookingMetrics } from '../types';

interface AdminDashboardProps {
  user: User;
  listings: Listing[];
  onViewListing: (listing: Listing) => void;
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
  onVerifyListing: (listingId: string) => void;
  onToggleMarketplace: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  listings,
  onViewListing,
  onEditListing,
  onDeleteListing,
  onVerifyListing,
  onToggleMarketplace,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'bookings' | 'revenue'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration (in production, fetch from Supabase)
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      listingId: '1',
      listingTitle: 'Timber Ridge Whitetail Haven',
      hunterId: 'h1',
      hunterName: 'John Doe',
      landownerId: 'o1',
      landownerName: 'John Miller',
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-03-17'),
      totalPrice: 900,
      status: 'confirmed',
      createdAt: new Date('2026-02-10'),
    },
    {
      id: '2',
      listingId: '3',
      listingTitle: 'Cypress Creek Waterfowl',
      hunterId: 'h2',
      hunterName: 'Jane Smith',
      landownerId: 'o3',
      landownerName: 'Beau Bridges',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-03'),
      totalPrice: 1100,
      status: 'pending',
      createdAt: new Date('2026-02-12'),
    },
  ]);

  const revenueMetrics: RevenueMetrics = {
    totalRevenue: 45680,
    dailyRevenue: 450,
    weeklyRevenue: 3200,
    monthlyRevenue: 12500,
    yearlyRevenue: 45680,
    revenueByProperty: [
      { listingId: '1', listingTitle: 'Timber Ridge Whitetail Haven', revenue: 18500 },
      { listingId: '3', listingTitle: 'Cypress Creek Waterfowl', revenue: 15200 },
      { listingId: '2', listingTitle: 'Rolling Plains Quail Ranch', revenue: 11980 },
    ],
    commissionEarned: 4568, // 10% commission
  };

  const userMetrics: UserMetrics = {
    totalUsers: 247,
    totalHunters: 189,
    totalLandowners: 57,
    totalAdmins: 1,
    newUsersThisWeek: 12,
    newUsersThisMonth: 43,
    activeUsers: 156,
  };

  const bookingMetrics: BookingMetrics = {
    totalBookings: 89,
    pendingBookings: 12,
    confirmedBookings: 45,
    completedBookings: 28,
    cancelledBookings: 4,
    averageBookingValue: 513,
    popularProperties: [
      { listingId: '1', listingTitle: 'Timber Ridge Whitetail Haven', bookingCount: 34 },
      { listingId: '3', listingTitle: 'Cypress Creek Waterfowl', bookingCount: 28 },
    ],
    popularGameTypes: [
      { gameType: 'Whitetail Deer', count: 42 },
      { gameType: 'Duck', count: 28 },
      { gameType: 'Turkey', count: 19 },
    ],
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">Admin Portal</h1>
              <p className="text-emerald-100 text-sm mt-1">
                Welcome back, {user.name} · Business Manager
              </p>
            </div>
            <button
              onClick={onToggleMarketplace}
              className="px-4 py-2 bg-white text-emerald-900 rounded-lg font-bold hover:bg-emerald-50 transition-colors"
            >
              View Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'listings', label: 'Listings', icon: '🏞️' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'revenue', label: 'Revenue', icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-900 text-emerald-900'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={`$${revenueMetrics.totalRevenue.toLocaleString()}`}
                subtitle={`$${revenueMetrics.monthlyRevenue.toLocaleString()} this month`}
                icon="💵"
                trend="+12%"
              />
              <MetricCard
                title="Total Bookings"
                value={bookingMetrics.totalBookings.toString()}
                subtitle={`${bookingMetrics.confirmedBookings} confirmed`}
                icon="📅"
                trend="+8%"
              />
              <MetricCard
                title="Total Users"
                value={userMetrics.totalUsers.toString()}
                subtitle={`${userMetrics.newUsersThisMonth} new this month`}
                icon="👥"
                trend="+15%"
              />
              <MetricCard
                title="Active Listings"
                value={listings.length.toString()}
                subtitle={`${listings.filter(l => l.isVerified).length} verified`}
                icon="🏞️"
                trend="+5%"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div>
                        <p className="font-bold text-sm text-stone-900">{booking.listingTitle}</p>
                        <p className="text-xs text-stone-500">{booking.hunterName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-emerald-900">${booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Popular Game Types</h3>
                <div className="space-y-3">
                  {bookingMetrics.popularGameTypes.map((item) => (
                    <div key={item.gameType} className="flex items-center justify-between">
                      <span className="text-sm text-stone-700">{item.gameType}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-stone-100 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${(item.count / 42) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-stone-900 w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Management Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Manage Listings</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase">Price/Day</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-stone-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={listing.images[0]} alt={listing.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-sm text-stone-900">{listing.title}</p>
                            <p className="text-xs text-stone-500">{listing.acreage} acres</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-700">{listing.location}</td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-900">${listing.pricePerDay}</td>
                      <td className="px-6 py-4">
                        {listing.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewListing(listing)}
                            className="text-emerald-900 hover:text-emerald-700 font-bold text-sm"
                          >
                            View
                          </button>
                          {!listing.isVerified && (
                            <button
                              onClick={() => onVerifyListing(listing.id)}
                              className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteListing(listing.id)}
                            className="text-red-600 hover:text-red-700 font-bold text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="text-emerald-900 text-3xl mb-2">🎯</div>
                <p className="text-3xl font-bold text-stone-900">{userMetrics.totalHunters}</p>
                <p className="text-sm text-stone-500">Total Hunters</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="text-emerald-900 text-3xl mb-2">🏡</div>
                <p className="text-3xl font-bold text-stone-900">{userMetrics.totalLandowners}</p>
                <p className="text-sm text-stone-500">Total Landowners</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="text-emerald-900 text-3xl mb-2">✨</div>
                <p className="text-3xl font-bold text-stone-900">{userMetrics.newUsersThisMonth}</p>
                <p className="text-sm text-stone-500">New This Month</p>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Revenue Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <p className="text-sm text-stone-500 mb-2">Daily Revenue</p>
                <p className="text-2xl font-bold text-stone-900">${revenueMetrics.dailyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <p className="text-sm text-stone-500 mb-2">Weekly Revenue</p>
                <p className="text-2xl font-bold text-stone-900">${revenueMetrics.weeklyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <p className="text-sm text-stone-500 mb-2">Monthly Revenue</p>
                <p className="text-2xl font-bold text-stone-900">${revenueMetrics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <p className="text-sm text-stone-500 mb-2">Commission Earned</p>
                <p className="text-2xl font-bold text-emerald-900">${revenueMetrics.commissionEarned.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Revenue by Property</h3>
              <div className="space-y-4">
                {revenueMetrics.revenueByProperty.map((item) => (
                  <div key={item.listingId} className="flex items-center justify-between">
                    <span className="text-sm text-stone-700">{item.listingTitle}</span>
                    <span className="text-lg font-bold text-stone-900">${item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, trend }) => {
  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
        }`}>
          {trend}
        </span>
      </div>
      <p className="text-sm text-stone-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-stone-900 mb-1">{value}</p>
      <p className="text-xs text-stone-500">{subtitle}</p>
    </div>
  );
};

export default AdminDashboard;
