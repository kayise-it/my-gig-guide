// Simple poster upload component - just selects files
import React, { useRef } from 'react';

const SimplePosterUpload = ({ onFileSelect, selectedFile, posterPreview, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="">
      {selectedFile && posterPreview ? (
        <div className="flex flex-col items-center">
          <img
            src={posterPreview}
            alt="Poster Preview"
            className="max-w-full h-auto max-h-96 rounded-lg shadow-md mb-4"
          />
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Change Poster
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Remove Poster
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to select poster</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default SimplePosterUpload;
