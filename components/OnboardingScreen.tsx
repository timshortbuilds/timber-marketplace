
import React from 'react';

interface OnboardingScreenProps {
  onSelectRole: (role: 'hunter' | 'landowner' | 'admin') => void;
  onLogout: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onSelectRole, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12">
          <div className="w-16 h-16 bg-emerald-900 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l-7 8h3v7h8v-7h3l-7-8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-4 font-serif">Welcome to Timber</h1>
          <p className="text-stone-600 text-lg">One last thing: how do you plan to use the platform?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button 
            onClick={() => onSelectRole('hunter')}
            className="group p-8 bg-white border-2 border-transparent hover:border-emerald-900 rounded-3xl shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
              <svg className="w-6 h-6 text-stone-600 group-hover:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">I am a Hunter</h3>
            <p className="text-sm text-stone-500 leading-relaxed">I want to find and lease private land for my next hunting trip.</p>
          </button>

          <button 
            onClick={() => onSelectRole('landowner')}
            className="group p-8 bg-white border-2 border-transparent hover:border-emerald-900 rounded-3xl shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
              <svg className="w-6 h-6 text-stone-600 group-hover:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">I am a Landowner</h3>
            <p className="text-sm text-stone-500 leading-relaxed">I want to list my property and earn income from verified hunters.</p>
          </button>

          <button
            onClick={() => onSelectRole('admin')}
            className="group p-8 bg-white border-2 border-transparent hover:border-emerald-900 rounded-3xl shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
              <svg className="w-6 h-6 text-stone-600 group-hover:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">I am an Admin</h3>
            <p className="text-sm text-stone-500 leading-relaxed">I manage the platform, users, and oversee all business operations.</p>
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="text-stone-400 hover:text-stone-600 text-sm font-bold uppercase tracking-widest"
        >
          Logout & Start Over
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
