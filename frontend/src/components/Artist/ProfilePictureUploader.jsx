/* /src/components/Artist/ProfilePictureUploader.jsx */
import React, { useState, useRef } from 'react';
import { PhotoIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfilePictureUploader = ({
  initialImage = null,
  onImageChange,
  size = 'lg',
  editable = true,
}) => {
  const [image, setImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const sizes = {
    sm: { container: 'h-16 w-16', icon: 'h-8 w-8' },
    md: { container: 'h-20 w-20', icon: 'h-10 w-10' },
    lg: { container: 'h-24 w-24', icon: 'h-12 w-12' },
    xl: { container: 'h-32 w-32', icon: 'h-16 w-16' },
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setImage(newImage);
        if (onImageChange) onImageChange(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    if (onImageChange) onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <div
        className={`${sizes[size].container} rounded-full border-4 border-white shadow-md overflow-hidden ${
          editable ? 'cursor-pointer' : 'cursor-default'
        } relative`}
        onClick={triggerFileInput}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            {editable && isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <PhotoIcon className={`${sizes[size].icon} text-white`} />
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full bg-indigo-200 flex items-center justify-center">
            <UserIcon className={`${sizes[size].icon} text-indigo-600`} />
          </div>
        )}
      </div>

      {editable && image && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          aria-label="Remove profile picture"
        >
          <XMarkIcon className="h-5 w-5 text-red-500" />
        </button>
      )}

      {editable && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}
    </div>
  );
};

export default ProfilePictureUploader;