// frontend/src/pages/AllShows.tsx
import { useState, useEffect } from 'react';

interface Show {
  id: string | number;
  title: string;
  description: string;
  eventDate: string;
}

export default function AllShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Shows</h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse text-lg">Loading shows...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">{error}</div>
      ) : shows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <p className="text-gray-500">No shows are currently available.</p>
        </div>
      ) : (
        /* CSS Grid: 1 column on mobile, 2 on tablets, 3 on desktops */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <div 
              key={show.id} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition"
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
    </div>
  );
}