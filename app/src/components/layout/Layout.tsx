import { useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header setSidebarOpen={setSidebarOpen} />
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto">
              {/* Page title with modern styling */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  {location.pathname === '/dashboard' ? 'Dashboard' : 
                   location.pathname.startsWith('/finance') ? 'Finance Manager' : 
                   location.pathname.startsWith('/household') ? 'Household Management' :
                   location.pathname.startsWith('/profile') ? 'Profile Settings' : 'Life Manager'}
                </h1>
                <p className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-400">
                  {location.pathname === '/dashboard' ? 'Welcome back! Here\'s your overview' : 
                   location.pathname.startsWith('/finance') ? 'Manage your finances and budgets' : 
                   location.pathname.startsWith('/household') ? 'Organize your household activities' :
                   location.pathname.startsWith('/profile') ? 'Update your personal information' : 'Manage your life efficiently'}
                </p>
              </div>
              
              {/* Page content with modern container */}
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
