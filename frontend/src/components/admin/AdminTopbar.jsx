import React from 'react';

export default function AdminTopbar({ onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <button onClick={onLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
      </div>
    </header>
  );
}


