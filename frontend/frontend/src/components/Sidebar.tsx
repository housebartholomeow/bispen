// frontend/src/components/Sidebar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white min-h-screen transition-all duration-300 flex flex-col shadow-xl relative z-10`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`font-bold text-xl overflow-hidden whitespace-nowrap transition-all ${isOpen ? 'block' : 'hidden'}`}>
          Menu
        </span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 mx-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 p-4 mt-4">
        <Link to="/" className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-md transition whitespace-nowrap overflow-hidden">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className={isOpen ? 'block' : 'hidden'}>Home</span>
        </Link>

        <Link to="/all-shows" className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-md transition whitespace-nowrap overflow-hidden">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          <span className={isOpen ? 'block' : 'hidden'}>All Shows</span>
        </Link>

        {/* Available to everyone now */}
        <Link to="/your-shows" className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-md transition whitespace-nowrap overflow-hidden text-blue-400">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <span className={isOpen ? 'block' : 'hidden'}>Your Shows</span>
        </Link>
      </nav>
    </div>
  );
}