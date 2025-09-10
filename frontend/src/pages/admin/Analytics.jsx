import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useAdminAPI from '../../hooks/useAdminAPI';
import {
  UsersIcon,
  MusicalNoteIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { stats, loading, error } = useAdminAPI();
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await stats.get();
      if (response.success) {
        setAnalytics(response.stats);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500"
    };

    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-md ${colorClasses[color]} bg-opacity-10 border border-transparent` }>
                <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="text-lg font-medium text-gray-900">{value}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Overview of platform statistics and metrics</p>
        </div>

        {/* Stats Grid */}
        {analytics && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Users" value={analytics.totalUsers} icon={UsersIcon} color="blue" />
            <StatCard
              title="Total Artists"
              value={analytics.totalArtists}
              icon={MusicalNoteIcon}
              color="yellow"
            />
            <StatCard
              title="Total Organisers"
              value={analytics.totalOrganisers}
              icon={BuildingOfficeIcon}
              color="green"
            />
            <StatCard
              title="Total Venues"
              value={analytics.totalVenues}
              icon={MapPinIcon}
              color="purple"
            />
            <StatCard
              title="Total Events"
              value={analytics.totalEvents}
              icon={CalendarIcon}
              color="red"
            />
            <StatCard
              title="Active Events"
              value={analytics.activeEvents}
              icon={CheckCircleIcon}
              color="green"
            />
            <StatCard
              title="Upcoming Events"
              value={analytics.upcomingEvents}
              icon={CalendarIcon}
              color="indigo"
            />
            <StatCard
              title="Recent Users (7 days)"
              value={analytics.recentUsers}
              icon={SparklesIcon}
              color="blue"
            />
            <StatCard
              title="Recent Events (7 days)"
              value={analytics.recentEvents}
              icon={SparklesIcon}
              color="yellow"
            />
          </div>
        )}

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Growth */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Growth Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {analytics?.recentUsers > 0 ? `+${analytics.recentUsers} this week` : 'No new users'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Event Activity</span>
                <span className="text-sm font-medium text-blue-600">
                  {analytics?.recentEvents > 0 ? `+${analytics.recentEvents} this week` : 'No new events'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Events</span>
                <span className="text-sm font-medium text-purple-600">
                  {analytics?.activeEvents || 0} currently running
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Platform Users</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics?.totalUsers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Content Creators</span>
                <span className="text-sm font-medium text-gray-900">
                  {(analytics?.totalArtists || 0) + (analytics?.totalOrganisers || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Venues</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics?.totalVenues || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics?.totalEvents || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics?.totalUsers > 0 ? 'Healthy' : 'Needs Users'}
              </div>
              <div className="text-sm text-gray-600">User Base</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics?.totalEvents > 0 ? 'Active' : 'Quiet'}
              </div>
              <div className="text-sm text-gray-600">Event Activity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics?.totalVenues > 0 ? 'Good' : 'Limited'}
              </div>
              <div className="text-sm text-gray-600">Venue Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;


