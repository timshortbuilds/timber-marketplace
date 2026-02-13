import React from 'react';
import { Listing, User } from '../types';
import ListingCard from './ListingCard';

interface HunterDashboardProps {
  user: User;
  savedListings: Listing[];
  onUpgrade: () => void;
  onViewListing: (l: Listing) => void;
  onToggleMarketplace: () => void;
}

const HunterDashboard: React.FC<HunterDashboardProps> = ({ 
  user, 
  savedListings, 
  onUpgrade, 
  onViewListing,
  onToggleMarketplace
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2 font-serif">Hunter Profile: {user.name}</h1>
          <p className="text-stone-500">Track your favorite properties and manage your Timber membership.</p>
        </div>
        <button 
          onClick={onToggleMarketplace}
          className="text-emerald-900 font-bold hover:underline"
        >
          Back to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className={`p-6 rounded-3xl border shadow-sm ${user.isMember ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'}`}>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Membership</p>
          <p className="text-3xl font-bold mb-4">{user.isMember ? 'Timber Pro' : 'Free Hunter'}</p>
          {!user.isMember && (
            <button onClick={onUpgrade} className="w-full bg-emerald-900 text-white py-2 rounded-xl text-sm font-bold">Go Pro $60/yr</button>
          )}
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Saved Land</p>
          <p className="text-3xl font-bold text-stone-900">{savedListings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Threads</p>
          <p className="text-3xl font-bold text-stone-900">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-stone-900 mb-8 font-serif">Saved Properties</h2>
      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} onClick={onViewListing} />
          ))}
        </div>
      ) : (
        <div className="bg-stone-100/50 border-2 border-dashed border-stone-200 rounded-3xl p-20 text-center">
          <p className="text-stone-500">No properties saved yet.</p>
        </div>
      )}
    </div>
  );
};

export default HunterDashboard;