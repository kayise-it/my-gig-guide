import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../Layout";
import {
  HomeIcon,
  UsersIcon,
  MusicalNoteIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

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
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: HomeIcon },
    { id: 'users', label: 'Users', path: '/admin/users', icon: UsersIcon },
    { id: 'artists', label: 'Artists', path: '/admin/artists', icon: MusicalNoteIcon },
    { id: 'organisers', label: 'Organisers', path: '/admin/organisers', icon: BuildingOfficeIcon },
    { id: 'venues', label: 'Venues', path: '/admin/venues', icon: MapPinIcon },
    { id: 'events', label: 'Events', path: '/admin/events', icon: CalendarIcon },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
    { id: 'paid-features', label: 'Paid Features', path: '/admin/paid-features', icon: ChartBarIcon },
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
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="inline-block h-5 w-5 mr-2 text-primary-600" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
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