// Simple gallery upload component - just selects files
import React, { useRef, useCallback } from 'react';

const SimpleGalleryUpload = ({ onFilesSelect, selectedFiles, galleryPreviews, onRemoveFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validate files
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
          alert(`${file.name}: Invalid file type`);
          return false;
        }
        if (!isValidSize) {
          alert(`${file.name}: File too large (max 5MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
    }
  }, [onFilesSelect]);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="">
      {/* Dropzone */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700">Drag & Drop images here</h3>
          <p className="text-gray-500">or</p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            Browse Files
          </button>
          <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF (Max 5MB each)</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg, image/png, image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Preview Area */}
      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Selected Images <span className="text-blue-600">({selectedFiles.length})</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {galleryPreviews[index] && (
                    <img
                      src={galleryPreviews[index]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                >
                  ×
                </button>
                <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGalleryUpload;
