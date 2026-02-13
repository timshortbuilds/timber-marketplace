import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onMessagesClick: () => void;
  onDashboardClick?: () => void;
  hasUnread?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onAuthClick, 
  onLogout, 
  onMessagesClick, 
  onDashboardClick,
  hasUnread 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 bg-emerald-900 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4c0-1-1-2-2-2M16 4c0-1 1-2 2-2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l-7 8h3v7h8v-7h3l-7-8z" />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <div className="absolute inset-0 bg-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-stone-900 font-serif">Timber</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {user && (
            <>
              <button 
                onClick={onDashboardClick}
                className="hover:text-emerald-800 transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={onMessagesClick}
                className="hover:text-emerald-800 transition-colors flex items-center gap-2 relative"
              >
                Messages
                {hasUnread && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-900">{user.name}</p>
                <div className="flex items-center gap-1 justify-end">
                  {user.role === 'hunter' && (
                    <span className={`text-[8px] font-black uppercase px-1 rounded ${user.isMember ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-stone-200 text-stone-500'}`}>
                      {user.isMember ? 'Timber Pro' : 'Guest'}
                    </span>
                  )}
                  {user.role === 'landowner' && (
                    <span className="text-[8px] font-black uppercase px-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">Landowner</span>
                  )}
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button onClick={onAuthClick} className="hidden sm:block text-sm font-medium text-stone-600 hover:text-stone-900">Login</button>
              <button onClick={onAuthClick} className="bg-emerald-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-stone-900 transition-all shadow-lg active:scale-95">
                Join Timber
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;