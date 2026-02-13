
import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, isSaved = false, onToggleSave }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onClick(listing)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Verified Badge */}
        {listing.isVerified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-emerald-100">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-tight">Verified</span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(e);
            }}
            className={`p-2 rounded-full shadow-sm transition-all duration-300 ${
              isSaved 
                ? 'bg-rose-500 text-white scale-110' 
                : 'bg-white/80 backdrop-blur-sm text-stone-600 hover:bg-white'
            }`}
          >
            <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1">
          {listing.gameTypes.slice(0, 2).map(game => (
            <span key={game} className="bg-emerald-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
              {game}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-900 line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-stone-700">{listing.rating}</span>
          </div>
        </div>
        <p className="text-sm text-stone-500">{listing.location}</p>
        <p className="text-sm text-stone-500">{listing.acreage} acres</p>
        <p className="mt-1 text-sm">
          <span className="font-bold text-stone-900">${listing.pricePerDay}</span>
          <span className="text-stone-500"> / day</span>
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
