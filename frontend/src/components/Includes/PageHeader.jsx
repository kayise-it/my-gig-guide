// frontend/src/components/Includes/PageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ HeaderName }) => {
  return (

    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{HeaderName}</h1>
        <div className="flex items-center space-x-4">

        </div>
      </div>
    </header>
  );
};

export default PageHeader;