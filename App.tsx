import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ListingCard from './components/ListingCard';
import ListingModal from './components/ListingModal';
import MapView from './components/MapView';
import AuthModal from './components/AuthModal';
import AddLandModal from './components/AddLandModal';
import LandownerDashboard from './components/LandownerDashboard';
import HunterDashboard from './components/HunterDashboard';
import AdminDashboard from './components/AdminDashboard';
import MessagingCenter from './components/MessagingCenter';
import PaymentModal from './components/PaymentModal';
import OnboardingScreen from './components/OnboardingScreen';
import { MOCK_LISTINGS } from './constants';
import { Listing, SearchFilters, User, Conversation, UserRole } from './types';
import { fetchListings, fetchUserMessages, sendMessage, isSupabaseConnected, hasSupabaseKeys, isSimulationForced, toggleForcedSimulation, supabase, signOut, updateUserRole, getSimulatedUser, saveSimulatedUser } from './services/supabase';

const TimberApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddLandModalOpen, setIsAddLandModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isConnectionPanelOpen, setIsConnectionPanelOpen] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
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
  });

  const needsOnboarding = useMemo(() => user !== null && !user.role, [user]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      if (isSupabaseConnected && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (session.user.user_metadata.role as UserRole) || null,
            isMember: !!session.user.user_metadata.is_member
          });
        } else {
          setUser(getSimulatedUser());
        }
      } else {
        setUser(getSimulatedUser());
      }

      try {
        const data = await fetchListings();
        setListings(data.length > 0 ? data : MOCK_LISTINGS);
      } catch (err) {
        setListings(MOCK_LISTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Poll for messages if user is logged in (Simple MVP approach)
    const messageInterval = setInterval(async () => {
      if (user && isSupabaseConnected) {
        const msgs = await fetchUserMessages(user.id);
        // Transform flat messages to conversation format if needed, 
        // or pass raw messages to MessagingCenter if you update that component.
        // For MVP, we will keep the UI simple.
      }
    }, 5000);

    let authSubscription: { unsubscribe: () => void } | null = null;

    if (isSupabaseConnected && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (session.user.user_metadata.role as UserRole) || null,
            isMember: !!session.user.user_metadata.is_member
          });
        }
      });
      authSubscription = data.subscription;
    }
    return () => {
      clearInterval(messageInterval);
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Sync URL with selectedListing state
  useEffect(() => {
    const match = matchPath('/listing/:id', location.pathname);
    if (match && match.params.id) {
      const found = listings.find(l => l.id === match.params.id);
      if (found) setSelectedListing(found);
    } else {
      setSelectedListing(null);
    }
  }, [location.pathname, listings]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    navigate('/');
  };

  const handleAddListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
    navigate('/dashboard');
  };

  const handleVerifyListing = (listingId: string) => {
    setListings(prev => prev.map(l =>
      l.id === listingId ? { ...l, isVerified: true } : l
    ));
  };

  const handleDeleteListing = (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(l => l.id !== listingId));
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchQuery = !searchFilters.query || 
        l.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        l.description.toLowerCase().includes(searchFilters.query.toLowerCase());
      
      const matchLocation = !searchFilters.location || 
        l.location.toLowerCase().includes(searchFilters.location.toLowerCase());

      const matchGameType = searchFilters.gameTypes.length === 0 || 
        searchFilters.gameTypes.some(gt => {
          if (gt === 'Duck' || gt === 'Goose') return l.gameTypes.includes('Duck') || l.gameTypes.includes('Goose');
          return l.gameTypes.includes(gt);
        });
      
      const matchAccommodations = searchFilters.accommodations.length === 0 ||
        searchFilters.accommodations.every(acc => (l.accommodations || []).includes(acc));

      const matchSportingArms = searchFilters.sportingArms.length === 0 ||
        searchFilters.sportingArms.some(arm => (l.sportingArms || []).includes(arm));

      const matchPrice = l.pricePerDay <= searchFilters.maxPrice;
      const matchAcreage = l.acreage <= searchFilters.maxAcreage;
      
      return matchQuery && matchLocation && matchGameType && matchAccommodations && matchSportingArms && matchPrice && matchAcreage;
    });
  }, [listings, searchFilters]);

  if (needsOnboarding) {
    return (
      <OnboardingScreen 
        onSelectRole={async (role) => {
          if (user && !user.id.startsWith('mock-') && isSupabaseConnected) {
             await updateUserRole(role);
          }
          const updated = { ...user!, role };
          setUser(updated);
          saveSimulatedUser(updated);
          navigate('/dashboard');
        }} 
        onLogout={handleLogout} 
      />
    );
  }

  const marketplaceElement = (
    <>
      <Hero filters={searchFilters} onFilterChange={setSearchFilters} />
      <FilterBar filters={searchFilters} onFilterChange={setSearchFilters} />
      
      <main className="max-w-7xl mx-auto px-4 mt-12 relative z-10 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif">
              {searchFilters.location ? `Available land in ${searchFilters.location}` : 'Featured Properties'}
            </h2>
            <p className="text-stone-500 text-sm">
              {filteredListings.length} exclusive leases found matching your criteria
            </p>
          </div>
          <div className="flex bg-white shadow-sm border border-stone-200 p-1 rounded-full self-start">
            <button onClick={() => setViewMode('list')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-emerald-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>List</button>
            <button onClick={() => setViewMode('map')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-emerald-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>Map</button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={(l) => navigate(`/listing/${l.id}`)} 
                isSaved={savedIds.includes(listing.id)}
                onToggleSave={() => {
                  setSavedIds(prev => prev.includes(listing.id) ? prev.filter(id => id !== listing.id) : [...prev, listing.id]);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="h-[650px]">
            <MapView listings={filteredListings} onListingClick={(l) => navigate(`/listing/${l.id}`)} />
          </div>
        )}

        {filteredListings.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No properties match your filters</h3>
            <p className="text-stone-500">Try expanding your search radius or price range.</p>
            <button 
              onClick={() => setSearchFilters({
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
              className="mt-6 text-emerald-900 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col relative">
      <Header 
        user={user} 
        onAuthClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout}
        onMessagesClick={() => navigate('/messages')}
        onDashboardClick={() => navigate('/dashboard')}
      />

      <div className="flex-1">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-emerald-900 mb-4"></div>
            <p className="text-stone-400 font-medium text-sm">Syncing with Timber Cloud...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={marketplaceElement} />
            <Route path="/listing/:id" element={marketplaceElement} />

            <Route path="/dashboard" element={
              <>
                {user?.role === 'landowner' && (
                  <LandownerDashboard 
                    user={user} 
                    listings={listings} 
                    onAddProperty={() => setIsAddLandModalOpen(true)}
                    onViewListing={setSelectedListing}
                    onRequestVerification={() => {}}
                    onToggleMarketplace={() => navigate('/')}
                  />
                )}
                
                {user?.role === 'hunter' && (
                  <HunterDashboard
                    user={user}
                    savedListings={listings.filter(l => savedIds.includes(l.id))}
                    onUpgrade={() => setIsPaymentModalOpen(true)}
                    onViewListing={setSelectedListing}
                    onToggleMarketplace={() => navigate('/')}
                  />
                )}

                {user?.role === 'admin' && (
                  <AdminDashboard
                    user={user}
                    listings={listings}
                    onViewListing={setSelectedListing}
                    onEditListing={(listing) => {
                      setSelectedListing(listing);
                      setIsAddLandModalOpen(true);
                    }}
                    onDeleteListing={handleDeleteListing}
                    onVerifyListing={handleVerifyListing}
                    onToggleMarketplace={() => navigate('/')}
                  />
                )}
              </>
            } />

            <Route path="/messages" element={user ? (
              <MessagingCenter 
                user={user}
                conversations={conversations}
                onSendMessage={async (conversationId, text) => {
                  // In a real app, you'd find the recipient ID from the conversation
                  // For MVP, we are just logging this action or you can implement the lookup
                  // const receiverId = ...
                  // await sendMessage(listingId, user.id, receiverId, text);
                  console.log("Sending message:", text);
                }}
                onClose={() => navigate('/')}
              />
            ) : <Navigate to="/" />} />
          </Routes>
        )}
      </div>

      <Footer />

      {/* Connection Manager Badge */}
      <div className="fixed bottom-6 left-6 z-[100] group">
        {isConnectionPanelOpen && (
          <div className="absolute bottom-full left-0 mb-4 w-64 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-200 p-6 animate-slide-up">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Connection Manager</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-stone-900">Supabase API</p>
                  <p className="text-[10px] text-stone-500">{hasSupabaseKeys ? 'Keys found' : 'Keys missing'}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${hasSupabaseKeys ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <div>
                  <p className="text-sm font-bold text-stone-900">Simulation Mode</p>
                </div>
                <button 
                  onClick={() => toggleForcedSimulation(!isSimulationForced())}
                  className={`w-10 h-6 rounded-full transition-colors relative ${isSimulationForced() ? 'bg-amber-500' : 'bg-stone-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSimulationForced() ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <button onClick={() => setIsConnectionPanelOpen(false)} className="w-full mt-4 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-stone-900">Close Panel</button>
          </div>
        )}
        <div 
          onClick={() => setIsConnectionPanelOpen(!isConnectionPanelOpen)}
          className={`px-4 py-2 rounded-full border shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${isSupabaseConnected ? 'bg-emerald-100/90 border-emerald-200 text-emerald-800' : 'bg-amber-100/90 border-amber-200 text-amber-800'}`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isSupabaseConnected ? 'Live' : 'Simulated'}
          <svg className={`w-3 h-3 ml-1 transition-transform ${isConnectionPanelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onMockLogin={(u) => {
            setUser(u);
            saveSimulatedUser(u);
            setIsAuthModalOpen(false);
          }} 
        />
      )}

      {isAddLandModalOpen && user && (
        <AddLandModal user={user} onClose={() => setIsAddLandModalOpen(false)} onAdd={handleAddListing} />
      )}

      {selectedListing && (
        <ListingModal 
          listing={selectedListing} 
          onClose={() => navigate('/')} 
          user={user}
          onUpgrade={() => setIsPaymentModalOpen(true)}
          onAuth={() => setIsAuthModalOpen(true)}
          onInquire={() => navigate('/messages')}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal 
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            if (user) {
              const updated = { ...user, isMember: true };
              setUser(updated);
              saveSimulatedUser(updated);
            }
            setIsPaymentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TimberApp />
    </BrowserRouter>
  );
};

export default App;