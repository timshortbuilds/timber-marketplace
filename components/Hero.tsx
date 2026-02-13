import React from 'react';
import { SearchFilters } from '../types';

interface HeroProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const Hero: React.FC<HeroProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="relative pt-24 pb-32 px-4 overflow-hidden min-h-[600px] flex flex-col justify-center bg-emerald-950">
      {/* Robust Background Layering */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* The Base Image */}
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
          alt="Lush forest woods" 
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
        />
        
        {/* The Overlays - Separated for maximum rendering compatibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-950/20 to-stone-50/10"></div>
        <div className="absolute inset-0 bg-emerald-950/20"></div>
        
        {/* Sophisticated subtle texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
      </div>

      {/* Content Layer */}
      <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-6 leading-[1.1] drop-shadow-2xl">
          Find your next <span className="text-emerald-400 italic">private</span> hunting haven.
        </h1>
        <p className="text-emerald-50 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-lg opacity-90">
          Access thousands of acres of managed, exclusive land. Skip the crowds and hunt on your own terms.
        </p>
      </div>

      {/* Hero Search Box */}
      <div className="max-w-3xl mx-auto w-full relative z-20">
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-2">
          
          {/* Location Input */}
          <div className="flex-[1.2] w-full flex items-center gap-3 px-6 py-4 border-r-0 md:border-r border-stone-200/50">
            <svg className="w-5 h-5 text-emerald-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none mb-1">Location</p>
              <input 
                type="text" 
                placeholder="Where are you hunting?"
                className="w-full bg-transparent text-sm font-bold text-stone-900 outline-none placeholder:text-stone-300"
                value={filters.location}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              />
            </div>
          </div>

          {/* Keywords Input */}
          <div className="flex-1 w-full flex items-center gap-3 px-6 py-4">
            <svg className="w-5 h-5 text-emerald-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none mb-1">Keywords</p>
              <input 
                type="text" 
                placeholder="Property name or features..."
                className="w-full bg-transparent text-sm font-bold text-stone-900 outline-none placeholder:text-stone-300"
                value={filters.query}
                onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
              />
            </div>
          </div>

          {/* CTA Search Button */}
          <button className="bg-emerald-900 text-white w-full md:w-16 h-16 rounded-full flex items-center justify-center hover:bg-stone-900 transition-all shadow-xl shadow-emerald-950/20 active:scale-95 group">
             <svg className="w-6 h-6 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;