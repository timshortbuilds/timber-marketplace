import React, { useState } from 'react';
import { User } from '../types';
import { supabase, signInWithGoogle, isSupabaseConnected } from '../services/supabase';

interface AuthModalProps {
  onClose: () => void;
  onMockLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onMockLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{message: string, isRateLimit: boolean} | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (!isSupabaseConnected) {
      handleSimulateRole('hunter');
      return;
    }
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorDetails({ 
          message: error.message, 
          isRateLimit: error.message.toLowerCase().includes('rate limit') 
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSimulateRole = (role: 'hunter' | 'landowner') => {
    onMockLogin({
      id: `mock-${role}-` + Math.random().toString(36).substr(2, 5),
      name: role === 'hunter' ? 'Travis Hunter' : 'Bill Landowner',
      email: `${role}@example.com`,
      role: role,
      isMember: role === 'hunter'
    });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!isSupabaseConnected) {
      setTimeout(() => {
        setIsLoading(false);
        onMockLogin({
          id: 'mock-email-user-' + Math.random().toString(36).substr(2, 5),
          name: email.split('@')[0],
          email: email,
          role: null
        });
      }, 800);
      return;
    }
    
    try {
      const { error } = await supabase!.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      setIsLoading(false);
      
      if (error) {
        const isRateLimit = error.message.toLowerCase().includes('rate limit');
        setErrorDetails({ 
          message: isRateLimit 
            ? "Supabase email rate limit exceeded. This usually happens on free plans after multiple attempts." 
            : error.message, 
          isRateLimit 
        });
      } else {
        setSuccessMessage('Check your email for the login link!');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorDetails({ message: "An unexpected error occurred.", isRateLimit: false });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-2 font-serif">Welcome to Timber</h2>
          <p className="text-stone-500 text-sm">Access private hunting land and expert landowners.</p>
        </div>

        {errorDetails?.isRateLimit && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-pulse">
            <p className="text-xs font-bold text-amber-800 mb-3">Rate Limit Hit!</p>
            <p className="text-[11px] text-amber-700 leading-relaxed mb-4">
              Supabase has temporarily limited email sends for your project. You can wait a few minutes, or continue with a simulated session to keep testing.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleSimulateRole('hunter')}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-amber-700 transition-colors"
              >
                Simulate Hunter
              </button>
              <button 
                onClick={() => handleSimulateRole('landowner')}
                className="flex-1 bg-white border border-amber-200 text-amber-700 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-amber-50 transition-colors"
              >
                Simulate Owner
              </button>
            </div>
          </div>
        )}

        {/* Google Auth Deferred to Phase 2
        <button 
          onClick={handleGoogleLogin} 
          className="w-full flex items-center justify-center gap-3 border border-stone-200 py-4 rounded-xl hover:bg-stone-50 transition-all mb-6 shadow-sm active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-bold text-stone-700">
            {isSupabaseConnected ? 'Continue with Google' : 'Join via Simulation'}
          </span>
        </button> 
        */}

        <div className="relative mb-6">
          {/* <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div> */}
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-2 text-stone-400 font-black">Or use email</span></div>
        </div>
        
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="relative">
            <input 
              required 
              type="email" 
              className={`w-full bg-stone-50 border ${errorDetails ? 'border-rose-300' : 'border-stone-200'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-800 transition-all`} 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 animate-fade-in">
              {successMessage}
            </div>
          )}

          {errorDetails && !errorDetails.isRateLimit && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-800 animate-fade-in">
              {errorDetails.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-stone-900 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isSupabaseConnected ? 'Get Magic Link' : 'Simulate Magic Link')}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-stone-400 font-medium">
          By continuing, you agree to Timber's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;