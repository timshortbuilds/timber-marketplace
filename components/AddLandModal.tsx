import React, { useState } from 'react';
import { Listing, User, Landowner } from '../types';
import { GAME_TYPES, ACCOMMODATIONS, SPORTING_ARMS } from '../constants';
import { insertListing, isSupabaseConnected, saveSimulatedListing } from '../services/supabase';

interface AddLandModalProps {
  onClose: () => void;
  onAdd: (listing: Listing) => void;
  user: User;
}

const AddLandModal: React.FC<AddLandModalProps> = ({ onClose, onAdd, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    pricePerDay: 0,
    description: '',
    acreage: 0,
    gameTypes: [] as string[],
    sportingArms: [] as string[],
    features: ['Blind Provided', 'Vehicle Access'],
    accommodations: [] as string[]
  });

  const toggleGameType = (game: string) => {
    setFormData(prev => ({
      ...prev,
      gameTypes: prev.gameTypes.includes(game) 
        ? prev.gameTypes.filter(g => g !== game) 
        : [...prev.gameTypes, game]
    }));
  };

  const toggleSportingArm = (arm: string) => {
    setFormData(prev => ({
      ...prev,
      sportingArms: prev.sportingArms.includes(arm)
        ? prev.sportingArms.filter(a => a !== arm)
        : [...prev.sportingArms, arm]
    }));
  };

  const toggleAccommodation = (acc: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.includes(acc)
        ? prev.accommodations.filter(a => a !== acc)
        : [...prev.accommodations, acc]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const imageUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;

    if (isSupabaseConnected) {
      const { data, error } = await insertListing({
        ...formData,
        images: [imageUrl],
      }, user.id);

      if (error) {
        alert("Database Error: " + error.message);
        setIsSubmitting(false);
        return;
      }

      if (data && data[0]) {
        const newListing: Listing = {
          ...formData,
          id: data[0].id,
          images: [imageUrl],
          landowner: {
            id: user.id,
            name: user.name,
            avatar: `https://picsum.photos/seed/${user.id}/100/100`,
            rating: 5.0,
            listingsCount: 1
          },
          rating: 5.0,
          reviews: 0,
          isVerified: false
        };
        onAdd(newListing);
      }
    } else {
      const newListing: Listing = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        images: [imageUrl],
        landowner: {
          id: user.id,
          name: user.name,
          avatar: `https://picsum.photos/seed/${user.id}/100/100`,
          rating: 5.0,
          listingsCount: 1
        },
        rating: 5.0,
        reviews: 0
      };
      saveSimulatedListing(newListing);
      onAdd(newListing);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-emerald-900 text-white">
          <div>
            <h2 className="text-xl font-bold leading-tight">List Your Property</h2>
            {!isSupabaseConnected && <p className="text-[10px] text-emerald-100/60 font-black uppercase tracking-widest mt-0.5">Simulation Persistence Enabled</p>}
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Property Title</label>
              <input 
                required
                disabled={isSubmitting}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-800 outline-none disabled:opacity-50"
                placeholder="e.g. Hidden Valley Deer Camp"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Location (County, State)</label>
              <input 
                required
                disabled={isSubmitting}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-800 outline-none disabled:opacity-50"
                placeholder="e.g. Pike County, IL"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Acreage</label>
              <input 
                required
                disabled={isSubmitting}
                type="number"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-800 outline-none disabled:opacity-50"
                placeholder="Total acres"
                onChange={e => setFormData({...formData, acreage: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Price per Day (USD)</label>
              <input 
                required
                disabled={isSubmitting}
                type="number"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-800 outline-none disabled:opacity-50"
                placeholder="$"
                onChange={e => setFormData({...formData, pricePerDay: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase">Available Game</label>
            <div className="flex flex-wrap gap-2">
              {GAME_TYPES.map(game => (
                <button
                  key={game}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => toggleGameType(game)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    formData.gameTypes.includes(game) 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  } disabled:opacity-50`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase">Permitted Sporting Arms</label>
            <div className="flex flex-wrap gap-2">
              {SPORTING_ARMS.map(arm => (
                <button
                  key={arm}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => toggleSportingArm(arm)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    formData.sportingArms.includes(arm) 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  } disabled:opacity-50`}
                >
                  {arm}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase">Accommodations</label>
            <div className="flex flex-wrap gap-2">
              {ACCOMMODATIONS.map(acc => (
                <button
                  key={acc}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => toggleAccommodation(acc)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    formData.accommodations.includes(acc) 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  } disabled:opacity-50`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase">Property Description</label>
            <textarea 
              required
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-800 outline-none resize-none disabled:opacity-50"
              placeholder="Tell hunters about the terrain, cover, and success history..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition-all shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : (isSupabaseConnected ? 'Publish Listing' : 'Simulate Publishing')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLandModal;