import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import StatsGrid from "../components/admin/StatsGrid";
import QuickActions from "../components/admin/QuickActions";
import useAdminData from "../hooks/useAdminData";

function AdminDashboard() {
  const { stats, loading, error, refetchStats } = useAdminData();
  const navigate = useNavigate();

  const handleActionClick = (actionId) => {
    console.log(`Action clicked: ${actionId}`);
    switch (actionId) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'artists':
        navigate('/admin/artists');
        break;
      case 'organisers':
        navigate('/admin/organisers');
        break;
      case 'venues':
        navigate('/admin/venues');
        break;
      case 'events':
        navigate('/admin/events');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      default:
        break;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={refetchStats}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Quick Actions */}
        <QuickActions onActionClick={handleActionClick} />
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;