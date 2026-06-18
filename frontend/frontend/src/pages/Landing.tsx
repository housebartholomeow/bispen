import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Welcome to the App</h1>
        <p className="text-gray-600 mb-8">Please log in to continue.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2 text-green-600">Authentication Successful!</h1>
        <p className="text-gray-700 mb-6">Welcome back, <strong>{user?.name}</strong></p>
        
        <div className="bg-gray-100 p-4 rounded text-left mb-6 font-mono text-sm">
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <button 
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}