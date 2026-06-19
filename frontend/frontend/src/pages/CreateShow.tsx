// frontend/src/pages/CreateShow.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreateShow() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <div className="p-8 text-center mt-10">Please log in to create a show.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/createShow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title,
          description,
          eventDate
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create show');
      }

      // Automatically redirect to "Your Shows" after successful creation
      navigate('/your-shows');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Show</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Bispen Tech Talk 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
            placeholder="What is this show about?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time</label>
          <input
            type="datetime-local"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Show'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/your-shows')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}