//GlobalProfileUploader - Gallery Upload Only
import React, { useState, useCallback } from 'react';
import ProfilePictureUploader from './ProfilePictureUploader';
import axios from '../api/axios';

const GlobalProfileUploader = ({
    userType,
    userId,
    username,
    whoWhere,
    imageType,
    initialImage,
    onUploadSuccess,
}) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadErrors, setUploadErrors] = useState([]);

    // Profile picture upload function
    const handleImageChange = async (base64Image) => {
        if (!userType || !userId || !username || !imageType) {
            console.error("Missing required user info");
            return;
        }

        // Handle image removal (when base64Image is null)
        if (!base64Image) {
            console.log("Image removal requested");
            try {
                if (imageType === 'profilepic') {
                    // Delete profile picture
                    await axios.delete(`/api/${whoWhere}/uploadprofilepicture/${userId}`);
                    console.log("Profile picture deleted successfully!");
                    
                    // Call success callback to refresh data
                    if (onUploadSuccess) {
                        onUploadSuccess();
                    }
                } else if (imageType === 'gallery') {
                    // For gallery, we need the image path to delete - this should be handled by a dedicated gallery component
                    console.log("Gallery image removal - this should be handled by the gallery component");
                }
            } catch (error) {
                console.error("Failed to delete image:", error);
            }
            return;
        }

        // Handle image upload
        if (imageType === 'profilepic') {
            const path = `../public/${userType}s`;
            const folder_name = `${userId}_${username.toLowerCase().replace(/\s+/g, "_")}`;
            const fileName = 'profile.jpg';

            const formData = new FormData();
            formData.append('uploaded_image', dataURLtoFile(base64Image, fileName));
            formData.append('path', path);
            formData.append('folder_name', folder_name);
            formData.append('user_type', userType);
            formData.append('image_type', imageType);

            try {
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
                
                // Call success callback to refresh data
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            } catch (error) {
                console.error("Profile picture upload failed", error);
            }
        } else if (imageType === 'gallery') {
            // Handle gallery image upload (single image)
            const formData = new FormData();
            formData.append('gallery_image', dataURLtoFile(base64Image, `gallery_${Date.now()}.jpg`));

            try {
                await axios.put(
                    `/api/${whoWhere}/galleryUploadSingle/${userId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log("Gallery image upload successful!");
                
                // Call success callback to refresh data
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            } catch (error) {
                console.error("Gallery image upload failed", error);
            }
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

    // Gallery upload functions
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length) {
            setFiles(prevFiles => [...prevFiles, ...validateFiles(selectedFiles)]);
        }
    };

    const validateFiles = (files) => {
        return files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
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

    const removeImage = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadErrors([]);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('gallery_images', file);
            });

            await axios.put(
                `/api/${whoWhere}/galleryUpload/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log("Gallery images upload successful!");
            setFiles([]);
            setUploadProgress({});
            
            // Call the success callback if provided
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error("Gallery images upload failed", error);
            setUploadErrors(prev => [...prev, 'Failed to upload images. Please try again.']);
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('gallery-upload').click();
    };

    // UI component - conditionally render based on imageType
    return (
        imageType === 'profilepic' ? (
            <ProfilePictureUploader
                initialImage={initialImage}
                onImageChange={handleImageChange}
                size="lg"
                editable={true}
            />
        ) : (
            // Gallery upload UI with drag-and-drop
            <div className="p-4 border rounded shadow-sm bg-white">
                <label className="block mb-2 font-semibold">Upload Gallery Images</label>
            
            {/* Dropzone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4 ${
                    isDragging
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
                    <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP (Max 5MB each)</p>
                </div>
                <input
                    type="file"
                    id="gallery-upload"
                    multiple
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Preview Area */}
            {files.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Selected Images <span className="text-blue-600">({files.length})</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {files.map((file, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
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
                            </div>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleGalleryUpload}
                        disabled={isUploading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
                    </button>
                </div>
            )}

            {/* Error Messages */}
            {uploadErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Upload Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                        {uploadErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        )
    );
};

export default GlobalProfileUploader;