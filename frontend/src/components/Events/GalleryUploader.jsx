// File location: frontend/src/components/Events/GalleryUploader.jsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/config';
const API_URL = `${API_BASE_URL}/api`;

export default function GalleryUploader({ onSave, orgFolder, userType = 'organisers' }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const hasImages = files.length > 0;
  const imageCount = files.length;

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length) {
      setFiles(prevFiles => [...prevFiles, ...validateFiles(selectedFiles)]);
    }
  };

  // File validation
  const validateFiles = (files) => {
    return files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        setUploadErrors(prev => [...prev, `${file.name}: Invalid file type`]);
        return false;
      }
      if (!isValidSize) {
        setUploadErrors(prev => [...prev, `${file.name}: File too large (max 5MB)`]);
        return false;
      }
      return true;
    });
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      setFiles(prevFiles => [...prevFiles, ...validateFiles(droppedFiles)]);
    }
  }, []);

  // Remove image
  const removeImage = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Upload handler
  const handleUpload = async () => {
    if (!hasImages || !orgFolder) return;

    setIsUploading(true);
    setUploadErrors([]);

    try {
      // Create gallery directory if it doesn't exist
      const galleryFolder = `${orgFolder}/gallery`;

      // Upload each file individually
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('gallery', file); // Must match the Multer field name
        formData.append('orgFolder', galleryFolder);

        const response = await axios.post(`${API_URL}/${userType}/upload-gallery`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`

          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          }
        });

        return response.data.filePath;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      // Call parent's onSave with array of file paths
      if (onSave) {
        onSave(uploadedPaths);
      }

      // Reset after successful upload
      setFiles([]);
      setUploadProgress({});
      setUploadSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadErrors(prev => [...prev, 'Failed to upload some images. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    document.getElementById('gallery-upload').click();
  };

  return (
    <div className="">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Event Gallery</h2>
        <p className="text-gray-600 mt-2">Upload multiple images for your event gallery</p>
      </div>

      {/* Dropzone */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          id="gallery-upload"
          multiple
          accept="image/jpeg, image/png, image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Preview Area */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-800 mb-4">
          Selected Images <span className="text-blue-600">({imageCount})</span>
        </h4>

        {hasImages ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  {uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1.5">
                      <div
                        className="bg-blue-500 h-1.5"
                        style={{ width: `${uploadProgress[file.name]}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <button
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  ×
                </button>
                <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
                {uploadProgress[file.name] === 100 && (
                  <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">No images selected yet</p>
          </div>
        )}
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p className="text-sm font-medium">Gallery images uploaded successfully!</p>
        </div>
      )}

      {/* Error Messages */}
      {uploadErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {uploadErrors.map((error, index) => (
            <p key={index} className="text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!hasImages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={() => setFiles([])}
          disabled={!hasImages}
        >
          Clear All
        </button>
        <button
          type="button"
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!hasImages || isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleUpload}
          disabled={!hasImages || isUploading}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload to Gallery'
          )}
        </button>
      </div>
    </div>
  );
}