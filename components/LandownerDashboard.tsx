import React from 'react';
import { Listing, User } from '../types';
import ListingCard from './ListingCard';

interface LandownerDashboardProps {
  user: User;
  listings: Listing[];
  onAddProperty: () => void;
  onViewListing: (l: Listing) => void;
  onRequestVerification: (id: string) => void;
  onToggleMarketplace?: () => void;
}

const LandownerDashboard: React.FC<LandownerDashboardProps> = ({ 
  user, 
  listings, 
  onAddProperty, 
  onViewListing,
  onRequestVerification,
  onToggleMarketplace
}) => {
  const myListings = listings.filter(l => l.landowner.id === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2 font-serif">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-stone-500">Manage your properties and track your leasing performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleMarketplace}
            className="text-stone-500 font-bold hover:text-emerald-900 transition-colors"
          >
            Explore Land
          </button>
          <button 
            onClick={onAddProperty}
            className="bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-lg flex items-center gap-2"
          >
            Add New Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase mb-1 tracking-wider">Total Earnings</p>
          <p className="text-3xl font-bold text-stone-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase mb-1 tracking-wider">Active Leases</p>
          <p className="text-3xl font-bold text-stone-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase mb-1 tracking-wider">Average Rating</p>
          <p className="text-3xl font-bold text-stone-900">5.0 ★</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-stone-900 mb-8 font-serif">My Properties</h2>
      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} onClick={onViewListing} />
          ))}
        </div>
      ) : (
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[3rem] p-20 text-center">
          <p className="text-stone-500 mb-6 font-medium">You haven't listed any land yet.</p>
          <button onClick={onAddProperty} className="bg-white text-emerald-800 px-8 py-3 rounded-full font-bold border border-stone-200 shadow-sm hover:shadow-md transition-all">Start listing today</button>
        </div>
      )}
    </div>
  );
};

export default LandownerDashboard;