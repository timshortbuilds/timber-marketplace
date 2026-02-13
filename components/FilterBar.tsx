import React, { useState, useRef, useEffect } from 'react';
import { SearchFilters } from '../types';
import { GAME_TYPES, ACCOMMODATIONS, SPORTING_ARMS } from '../constants';

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGame = (game: string) => {
    const newGames = filters.gameTypes.includes(game)
      ? filters.gameTypes.filter(g => g !== game)
      : [...filters.gameTypes, game];
    onFilterChange({ ...filters, gameTypes: newGames });
  };

  const toggleAccommodation = (acc: string) => {
    const newAcc = filters.accommodations.includes(acc)
      ? filters.accommodations.filter(a => a !== acc)
      : [...filters.accommodations, acc];
    onFilterChange({ ...filters, accommodations: newAcc });
  };

  const toggleSportingArm = (arm: string) => {
    const newArms = filters.sportingArms.includes(arm)
      ? filters.sportingArms.filter(a => a !== arm)
      : [...filters.sportingArms, arm];
    onFilterChange({ ...filters, sportingArms: newArms });
  };

  const dropdownBaseClass = "absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 z-50 animate-slide-up min-w-[300px]";

  const filterButtonClass = (isActive: boolean, hasValue: boolean) => `
    flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap
    ${isActive || hasValue 
      ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]' 
      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'}
  `;

  // --- CALENDAR RENDER LOGIC ---
  const renderCalendar = () => {
    const days = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Availability mock generator (randomized for heat scale)
    const getHeatColor = (day: number) => {
      // Logic: simulate high demand on weekends
      const date = new Date(currentYear, currentMonth, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) return 'bg-stone-200 text-stone-500'; // Low Availability (Gray)
      if (day % 3 === 0) return 'bg-emerald-200 text-emerald-800'; // Moderate (Light Green)
      return 'bg-emerald-500 text-white'; // High (Emerald)
    };

    // Pad first days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = filters.startDate && filters.startDate.getDate() === d;
      days.push(
        <button
          key={d}
          onClick={() => {
            const date = new Date(currentYear, currentMonth, d);
            onFilterChange({ ...filters, startDate: date, endDate: date });
          }}
          className={`h-8 w-8 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center relative group
            ${isSelected ? 'ring-2 ring-emerald-900 ring-offset-2' : ''}
            ${getHeatColor(d)}
          `}
        >
          {d}
          {/* Tooltip on hover */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {d % 3 === 0 ? 'Moderate' : d % 7 === 0 || d % 7 === 6 ? 'Low' : 'High'} Availability
          </span>
        </button>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-[10px] font-black text-stone-400 uppercase mb-2">{d}</div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-stone-200 py-4 px-4 shadow-sm" ref={containerRef}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        
        {/* --- DATE FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            className={filterButtonClass(activeDropdown === 'dates', !!filters.startDate)}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {filters.startDate ? filters.startDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Any Dates'}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'dates' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {activeDropdown === 'dates' && (
            <div className={dropdownBaseClass}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Market Availability</p>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500"></div><span className="text-[8px] text-stone-400">High</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-stone-200"></div><span className="text-[8px] text-stone-400">Low</span></div>
                </div>
              </div>
              {renderCalendar()}
              <button 
                onClick={() => onFilterChange({ ...filters, startDate: null, endDate: null })}
                className="w-full mt-4 pt-4 text-[10px] font-black uppercase text-stone-400 tracking-widest hover:text-rose-600 border-t border-stone-100 transition-colors"
              >
                Reset Dates
              </button>
            </div>
          )}
        </div>

        {/* --- GAME FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'game' ? null : 'game')}
            className={filterButtonClass(activeDropdown === 'game', filters.gameTypes.length > 0)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c-.5 0-1 .5-1 1v2.1c-1.3.4-2.5 1.2-3.4 2.3L6.1 6.1C5.7 5.7 5.1 5.7 4.7 6.1s-.4 1 0 1.4l1.5 1.5c-1.1 1.4-1.7 3.2-1.7 5 0 2.2 1.1 4.1 2.8 5.3L6.1 20.5c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.2-1.2c1.1.4 2.3.6 3.5.6s2.4-.2 3.5-.6l1.2 1.2c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-1.2-1.2c1.7-1.2 2.8-3.1 2.8-5.3 0-1.8-.6-3.6-1.7-5l1.5-1.5c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.5 1.5c-.9-1.1-2.1-1.9-3.4-2.3V3c0-.5-.5-1-1-1z" />
            </svg>
            Game {filters.gameTypes.length > 0 ? `(${filters.gameTypes.length})` : ''}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'game' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {activeDropdown === 'game' && (
            <div className={dropdownBaseClass}>
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4">Target Species</p>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {GAME_TYPES.map(game => (
                  <label key={game} className="flex items-center gap-3 cursor-pointer group hover:bg-stone-50 p-2 rounded-xl transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-stone-200 rounded-lg checked:bg-emerald-600 checked:border-emerald-600 transition-all"
                        checked={filters.gameTypes.includes(game)}
                        onChange={() => toggleGame(game)}
                      />
                      <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">{game}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- SPORTING ARMS FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'arms' ? null : 'arms')}
            className={filterButtonClass(activeDropdown === 'arms', filters.sportingArms.length > 0)}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>
            </svg>
            Sporting Arms {filters.sportingArms.length > 0 ? `(${filters.sportingArms.length})` : ''}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'arms' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {activeDropdown === 'arms' && (
            <div className={dropdownBaseClass}>
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4">Method of Take</p>
              <div className="grid grid-cols-1 gap-2">
                {SPORTING_ARMS.map(arm => (
                  <label key={arm} className="flex items-center gap-3 cursor-pointer group hover:bg-stone-50 p-2 rounded-xl transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-stone-200 rounded-lg checked:bg-emerald-600 checked:border-emerald-600 transition-all"
                        checked={filters.sportingArms.includes(arm)}
                        onChange={() => toggleSportingArm(arm)}
                      />
                      <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">{arm}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- ACCOMMODATIONS FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'accommodations' ? null : 'accommodations')}
            className={filterButtonClass(activeDropdown === 'accommodations', filters.accommodations.length > 0)}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accommodations {filters.accommodations.length > 0 ? `(${filters.accommodations.length})` : ''}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'accommodations' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {activeDropdown === 'accommodations' && (
            <div className={dropdownBaseClass}>
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4">Property Amenities</p>
              <div className="grid grid-cols-1 gap-2">
                {ACCOMMODATIONS.map(acc => (
                  <label key={acc} className="flex items-center gap-3 cursor-pointer group hover:bg-stone-50 p-2 rounded-xl transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-stone-200 rounded-lg checked:bg-emerald-600 checked:border-emerald-600 transition-all"
                        checked={filters.accommodations.includes(acc)}
                        onChange={() => toggleAccommodation(acc)}
                      />
                      <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-900">{acc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- SIZE FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
            className={filterButtonClass(activeDropdown === 'size', filters.maxAcreage < 5000)}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Size: {filters.maxAcreage >= 5000 ? 'Any' : `< ${filters.maxAcreage} ac`}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeDropdown === 'size' && (
            <div className={dropdownBaseClass}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Min. Acreage</p>
                <span className="text-sm font-bold text-emerald-900">{filters.maxAcreage >= 5000 ? '5,000+' : filters.maxAcreage.toLocaleString()} ac</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="50"
                className="accent-emerald-900 w-full mb-4 h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                value={filters.maxAcreage}
                onChange={(e) => onFilterChange({ ...filters, maxAcreage: parseInt(e.target.value) })}
              />
            </div>
          )}
        </div>

        {/* --- PRICE FILTER --- */}
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
            className={filterButtonClass(activeDropdown === 'price', filters.maxPrice < 1500)}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price: {filters.maxPrice >= 1500 ? 'Any' : `Under $${filters.maxPrice}`}
            <svg className={`w-3 h-3 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeDropdown === 'price' && (
            <div className={dropdownBaseClass}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Max Daily Rate</p>
                <span className="text-sm font-bold text-emerald-900">${filters.maxPrice >= 1500 ? '1,500+' : filters.maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1500" 
                step="25"
                className="accent-emerald-900 w-full mb-4 h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })}
              />
            </div>
          )}
        </div>

        {/* --- RESET BUTTON --- */}
        <div className="flex-1 flex justify-end">
          <button 
            onClick={() => onFilterChange({
              query: '',
              location: '',
              gameTypes: [],
              accommodations: [],
              sportingArms: [],
              startDate: null,
              endDate: null,
              minAcreage: 0,
              maxAcreage: 5000,
              radius: 100,
              minPrice: 0,
              maxPrice: 1500
            })}
            className="text-[10px] font-black uppercase text-stone-400 tracking-widest hover:text-rose-600 transition-colors p-2 flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;