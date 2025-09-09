// File: frontend/src/components/admin/StatsCard.jsx
import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  loading = false,
  subtitle = null 
}) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-6 w-6 ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                ) : (
                  value
                )}
              </dd>
              {subtitle && (
                <dd className="text-xs text-gray-500 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;


