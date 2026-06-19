// frontend/src/pages/YourShows.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Show {
  id: string | number;
  title: string;
  description: string;
  eventDate: string;
}

export default function YourShows() {
  const { user, isAuthenticated } = useAuth();
  
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch only this host's shows
  useEffect(() => {
    const fetchHostShows = async () => {
      // Don't try fetching if they aren't a logged-in host
      if (!isAuthenticated || user?.role !== 'host') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/shows/host/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch your shows');
        const data = await response.json();
        setShows(data.shows); 
      } catch (err) {
        setError('Error loading your shows.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostShows();
  }, [isAuthenticated, user]);

  // 1. Unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">You are not logged in</h2>
        <p className="text-gray-600 mb-6">Sign in to create shows.</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  // 2. Authenticated users who are NOT hosts (e.g., attendees)
  if (user?.role !== 'host') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendee Dashboard</h2>
        <p className="text-gray-600 mb-6">You currently have no shows created.</p>
        <Link to="/create-show" className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition">
          Create Your First Show
        </Link>
      </div>
    );
  }

  // 3. Hosts
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Shows</h1>
        <Link to="/create-show" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition">
          + Create New Show
        </Link>
      </div>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse text-lg">Loading your shows...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">{error}</div>
      ) : shows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <p className="text-gray-500 mb-4">You haven't created any shows yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <div key={show.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition">
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
    </div>
  );
}