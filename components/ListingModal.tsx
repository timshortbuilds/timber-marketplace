
import React from 'react';
import { Listing, User } from '../types';

interface ListingModalProps {
  listing: Listing;
  onClose: () => void;
  user: User | null;
  onUpgrade: () => void;
  onAuth: () => void;
  onInquire: (listing: Listing) => void;
}

const ListingModal: React.FC<ListingModalProps> = ({ listing, onClose, user, onUpgrade, onAuth, onInquire }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-1/2 h-64 md:h-auto">
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold text-stone-900 leading-tight font-serif">{listing.title}</h2>
                {listing.isVerified && (
                  <div className="flex-shrink-0 bg-emerald-100 text-emerald-700 p-1 rounded-full" title="Timber Verified Property">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-stone-500 font-medium">{listing.location}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-emerald-800">${listing.pricePerDay}</span>
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Per Day</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {listing.gameTypes.map(game => (
              <span key={game} className="bg-stone-100 text-stone-700 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-stone-200">
                {game}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-stone-100 mb-6">
            <img src={listing.landowner.avatar} className="w-12 h-12 rounded-full ring-2 ring-emerald-50/50" alt="" />
            <div>
              <p className="text-sm font-semibold">Hosted by {listing.landowner.name}</p>
              <p className="text-xs text-stone-500">{listing.landowner.rating} Rating • {listing.landowner.listingsCount} properties</p>
            </div>
          </div>

          <div className="flex-1">
            {listing.isVerified && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-emerald-900">Timber Verified</h5>
                    <p className="text-[11px] text-emerald-700 leading-relaxed mt-1">
                      Manually reviewed land boundaries and verified owner credentials for your safety.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h4 className="font-bold mb-2 text-stone-900 text-sm">Property Overview</h4>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              {listing.description}
            </p>

            <h4 className="font-bold mb-3 text-stone-900 text-sm">Key Features</h4>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {listing.features.map(feature => (
                <div key={feature} className="flex items-center gap-2 text-stone-600 text-xs font-medium">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
              <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {listing.acreage} total acres
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            {!user ? (
              <button 
                onClick={onAuth}
                className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-stone-900 transition-all shadow-lg"
              >
                Sign Up to Message Owner
              </button>
            ) : user.role === 'landowner' ? (
              <div className="bg-stone-100 p-4 rounded-2xl text-center text-xs text-stone-500 italic">
                Switch to a hunter account to message other landowners.
              </div>
            ) : !user.isMember ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 font-bold mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Timber Pro Membership Required
                </div>
                <p className="text-xs text-amber-700 mb-5 leading-relaxed">
                  Join **Timber Pro** for $60/year to unlock direct messaging, property calendars, and secure booking.
                </p>
                <button 
                  onClick={onUpgrade}
                  className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Upgrade Now - $60/yr
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onInquire(listing)}
                className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-stone-900 transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message Landowner
              </button>
            )}
            
            <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest font-bold">
              Timber Secured Communication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
