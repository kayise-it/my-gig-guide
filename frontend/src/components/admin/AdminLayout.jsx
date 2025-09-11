import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout({ children }) {
  const [management, setManagement] = useState(null);

  useEffect(() => {
    const managementData = localStorage.getItem('management');
    if (managementData) {
      setManagement(JSON.parse(managementData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('management_token');
    localStorage.removeItem('management');
    window.location.href = '/management-login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onLogout={handleLogout} />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}