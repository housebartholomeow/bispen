import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define the structure of a Show based on your backend schema
interface Show {
  id: string | number;
  title: string;
  description: string;
  eventDate: string;
  hostId: string | number;
}

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // References to keep track of the carousel div and pause state without re-rendering
  const carouselRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  // 1. Fetch Shows Effect
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/shows');
        if (!response.ok) throw new Error('Failed to fetch shows');
        const data = await response.json();
        setShows(data.shows); 
      } catch (err) {
        setError('Error loading shows.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  // 2. Auto-Scroll Effect for the loop
  useEffect(() => {
    if (shows.length === 0) return;

    // Change this number to adjust how fast it moves (3000 = 3 seconds)
    const SCROLL_INTERVAL_MS = 1000; 

    const autoScroll = setInterval(() => {
      // Only scroll if the user is not interacting with the carousel
      if (!isPausedRef.current && carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        
        // Check if we hit the end of the carousel
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          // Rewind back to the start smoothly
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll right by roughly one card's width
          carouselRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, SCROLL_INTERVAL_MS);

    return () => clearInterval(autoScroll);
  }, [shows]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="text-xl font-bold text-gray-800">Bispen</div>
        <div>
          {!isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.role}</p>
              </div>
              <button 
                onClick={logout}
                className="text-red-600 border border-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content - Shows Carousel */}
      <main className="flex-grow p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Shows</h2>
            {isAuthenticated && user?.role === 'host' && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Host View
              </span>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500 text-lg animate-pulse">Loading shows...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">{error}</div>
        ) : shows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
            <p className="text-gray-500">No shows are currently available.</p>
          </div>
        ) : (
          /* Carousel Container */
          <div 
            ref={carouselRef}
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onTouchStart={() => (isPausedRef.current = true)}
            onTouchEnd={() => setTimeout(() => { isPausedRef.current = false }, 1000)}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            
            {shows.map((show) => (
              <div 
                key={show.id} 
                className="min-w-[300px] md:min-w-[350px] w-[85vw] md:w-[350px] snap-start shrink-0 bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition whitespace-normal cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{show.title}</h3>
                <p className="text-sm font-medium text-blue-600 mb-4">
                  {new Date(show.eventDate).toLocaleDateString(undefined, { 
                    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-600 flex-grow text-sm line-clamp-4">
                  {show.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}