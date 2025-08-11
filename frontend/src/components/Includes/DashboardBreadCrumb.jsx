// frontend/src/components/Includes/DashboardBreadCrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const DashboardBreadCrumb = ({ breadcrumbs }) => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center py-3" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            
            {/* Home Icon */}
            <li>
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>

            {/* Breadcrumb Items */}
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={index} className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 text-gray-300 mx-2 flex-shrink-0" />
                  
                  {!isLast ? (
                    <Link
                      to={breadcrumb.path}
                      className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200 capitalize truncate max-w-xs"
                      title={breadcrumb.label}
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span 
                      className="text-sm font-semibold text-gray-900 capitalize truncate max-w-xs"
                      title={breadcrumb.label}
                    >
                      {breadcrumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default DashboardBreadCrumb;