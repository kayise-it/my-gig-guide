// frontend/src/components/Includes/DashboardBreadCrumb.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardBreadCrumb = ({ breadcrumbs }) => {
  return (
    <nav className="flex items-center text-sm text-gray-600 py-6 px-4 my-6 rounded-lg bg-slate-100">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={index} className="flex place-items-start">
            {!isLast ? (
              <>
                <Link
                  to={breadcrumb.path}
                  className="text-indigo-600 hover:underline capitalize "
                >
                  {breadcrumb.label}
                </Link>
                <span className="mx-1 text-gray-400">/</span>
              </>
            ) : (
              <span className="font-medium text-gray-900 capitalize">{breadcrumb.label}</span>
            )}
          </div>
        );
      })}
    </nav>
    
  );
};

export default DashboardBreadCrumb;