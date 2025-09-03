/* /src/components/ProfilePictureUploader.jsx */
import React, { useState, useRef, useEffect } from 'react';
import { PhotoIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from '../api/axios';

const ProfilePictureUploader = ({
  userType,
  userId,
  username,
  whoWhere,
  initialImage = null,
  onImageChange,
  size = 'lg',
  editable = true,
}) => {
  const [image, setImage] = useState(initialImage);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Update internal state when initialImage prop changes
  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const sizes = {
    sm: { container: 'h-16 w-16', icon: 'h-8 w-8' },
    md: { container: 'h-20 w-20', icon: 'h-10 w-10' },
    lg: { container: 'h-24 w-24', icon: 'h-12 w-12' },
    xl: { container: 'h-32 w-32', icon: 'h-16 w-16' },
  };

  const handleImageUpload = async (base64Image) => {
    if (!userType || !userId || !username) {
      console.error("Missing required user info");
      return;
    }

    setIsUploading(true);

    try {
      // Handle image removal (when base64Image is null)
      if (!base64Image) {
        console.log("Image removal requested");
        await axios.delete(`/api/${whoWhere}/uploadprofilepicture/${userId}`);
        console.log("Profile picture deleted successfully!");
        setImage(null);
        if (onImageChange) onImageChange(null);
        return;
      }

      // Handle image upload
      const path = `../public/${userType}s`;
      const folder_name = `${userId}_${username.toLowerCase().replace(/\s+/g, "_")}`;
      const fileName = 'profile.jpg';

      const formData = new FormData();
      formData.append('profile_picture', dataURLtoFile(base64Image, fileName));

      await axios.put(
        `/api/${whoWhere}/uploadprofilepicture/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("Profile picture upload successful!");
      setImage(base64Image);
      if (onImageChange) onImageChange(base64Image);
    } catch (error) {
      console.error("Profile picture upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        handleImageUpload(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    handleImageUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    if (editable && fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <div
        className={`${sizes[size].container} rounded-full border-4 border-white shadow-md overflow-hidden ${
          editable && !isUploading ? 'cursor-pointer' : 'cursor-default'
        } relative`}
        onClick={triggerFileInput}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Profilsse"
              className="h-full w-full object-cover"
            />
            {editable && isHovered && !isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <PhotoIcon className={`${sizes[size].icon} text-white`} />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full bg-red-200 flex items-center justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            ) : (
              <UserIcon className={`${sizes[size].icon} text-indigo-600`} />
            )}
          </div>
        )}
      </div>

      {editable && image && !isUploading && (
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