// frontend/src/components/Layout.tsx
import Sidebar from './Sidebar';

// This acts as a wrapper for all your pages
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}