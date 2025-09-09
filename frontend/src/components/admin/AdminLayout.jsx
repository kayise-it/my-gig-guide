import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../Layout";

const AdminLayout = ({ children }) => {
  const [majesty, setMajesty] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const majestyData = localStorage.getItem('majesty');
    if (majestyData) {
      setMajesty(JSON.parse(majestyData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('majesty_token');
    localStorage.removeItem('majesty');
    window.location.href = '/majesty-login';
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: '🏠' },
    { id: 'users', label: 'Users', path: '/admin/users', icon: '👥' },
    { id: 'artists', label: 'Artists', path: '/admin/artists', icon: '🎭' },
    { id: 'organisers', label: 'Organisers', path: '/admin/organisers', icon: '🏢' },
    { id: 'venues', label: 'Venues', path: '/admin/venues', icon: '📍' },
    { id: 'events', label: 'Events', path: '/admin/events', icon: '🎪' },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: '📊' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white shadow rounded-lg p-4 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Majesty Portal</h3>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;