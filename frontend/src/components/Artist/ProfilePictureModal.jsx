// ../components/Artist/ProfilePictureModal.jsx
import React, { useState, useRef } from 'react';
import { XMarkIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';

const ProfilePictureModal = ({ isOpen, onClose, initialImage, onSave, settings }) => {
  const [image, setImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [rawFile, setRawFile] = useState(null);

  // Update image state when initialImage prop changes
  React.useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file); // ✅ store the File object for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // preview
      };
      reader.readAsDataURL(file);
    }
  };

const handleSave = async () => {
  setIsLoading(true);
  try {
    const destinationPath = settings.path + settings.folder_name;
    await onSave(rawFile, destinationPath); // ✅ send actual file
    onClose();
  } catch (error) {
    console.error("Error saving profile picture:", error);
  } finally {
    setIsLoading(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Update Profile Picture</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative mb-6">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex space-x-4 w-full">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
            >
              Upload Photo
            </button>
            {image && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-1" />
                    Save
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;