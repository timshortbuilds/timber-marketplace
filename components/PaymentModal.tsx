
import React, { useState } from 'react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    // Simulate Stripe payment processing
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {status === 'success' ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 font-serif">Welcome to Timber Pro!</h2>
            <p className="text-stone-500 text-sm">Your payment was successful. Direct messaging is now unlocked.</p>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-900 rounded flex items-center justify-center text-white text-[10px] font-bold">T</div>
                <span className="text-sm font-bold text-stone-900">Timber Pro Upgrade</span>
              </div>
              <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-3xl font-bold text-stone-900">$60.00</h3>
                <span className="text-stone-400 text-sm font-medium">USD / year</span>
              </div>
              <p className="text-stone-500 text-xs font-medium">Billed annually. Cancel anytime.</p>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Card Information</label>
                  <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Card number" 
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone-300" 
                      disabled={status === 'processing'}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="MM / YY" 
                      className="w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-stone-300"
                      disabled={status === 'processing'}
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-stone-300"
                      disabled={status === 'processing'}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Country</label>
                  <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none cursor-pointer">
                    <option>United States</option>
                    <option>Canada</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-4 text-[11px] text-stone-400">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure payment powered by Stripe
              </div>

              <button 
                type="submit"
                disabled={status === 'processing'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                  status === 'processing' 
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                    : 'bg-emerald-900 text-white hover:bg-stone-900'
                }`}
              >
                {status === 'processing' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay $60.00'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
