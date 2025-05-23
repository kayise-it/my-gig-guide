import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { PencilIcon, CheckIcon, PhotoIcon } from '@heroicons/react/24/outline';
import DashboardBreadCrumb from '../../../components/Includes/DashboardBreadCrumb';
import PageHeader from '../../../components/Includes/PageHeader';

export default function OrganiserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/organisers/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);
                reset(response.data); // Initialize form with fetched data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [reset]);

    const breadcrumbs = [
        { label: 'Dashboard', path: '/organiser/dashboard' },
        { label: 'Organisation Profile', path: '/organiser/dashboard/organisation-profile' },
    ];

    console.log("Profile data:", profile); // Log the profile data for debugging

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Prepare form data for file upload
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('contact_email', data.contact_email);
            formData.append('phone_number', data.phone_number);
            formData.append('website', data.website);

            // Append logo file if selected
            if (data.logo[0]) {
                formData.append('logo', data.logo[0]);
            }

            const response = await axios.put('/api/organisers/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setProfile(response.data);
            setEditMode(false);
            setImagePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader HeaderName="Organiser Profile" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
                <div className="px-6 py-8">
                    <div className="flex justify-between items-start mb-6">
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setImagePreview(null);
                                        reset(profile);
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                                {editMode ? (
                                    <>
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                            {imagePreview || profile.logo ? (
                                                <img
                                                    src={imagePreview || profile.logo}
                                                    alt="Organiser logo"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                                                    <PhotoIcon className="h-8 w-8" />
                                                    <span className="text-xs mt-1">Upload Logo</span>
                                                </div>
                                            )}
                                        </label>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            {...register('logo')}
                                            onChange={handleImageChange}
                                        />
                                    </>
                                ) : (
                                    <img
                                        src={profile.logo || 'https://via.placeholder.com/150'}
                                        alt="Organiser logo"
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Profile Form */}
                        {editMode ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Organisation Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            {...register('name', { required: 'Name is required' })}
                                            className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                    </div>

                                    <div className="sm:col-span-6">
                                        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                                            Contact Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="contact_email"
                                            {...register('contact_email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            className={`mt-1 block w-full border ${errors.contact_email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        />
                                        {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>}
                                    </div>

                                    <div className="sm:col-span-6">
                                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone_number"
                                            {...register('phone_number')}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="sm:col-span-6">
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            {...register('website')}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <h2 className="text-lg font-medium text-gray-900">{profile.name}</h2>
                                    </div>

                                    <div className="sm:col-span-6">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Contact Email:</span> {profile.contact_email}
                                        </p>
                                    </div>

                                    {profile.phone_number && (
                                        <div className="sm:col-span-6">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Phone:</span> {profile.phone_number}
                                            </p>
                                        </div>
                                    )}

                                    {profile.website && (
                                        <div className="sm:col-span-6">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Website:</span>{' '}
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                                                    {profile.website}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Gallery Management Section */}
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {profile.gallery && profile.gallery.length > 0 ? (
                                profile.gallery.map((image, index) => (
                                    <div key={index} className="relative group aspect-square overflow-hidden rounded-lg shadow">
                                        <img
                                            src={image}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {editMode && (
                                            <button
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    // Handle image removal
                                                    const updatedGallery = [...profile.gallery];
                                                    updatedGallery.splice(index, 1);
                                                    setProfile({ ...profile, gallery: updatedGallery });
                                                }}
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No images in gallery</p>
                            )}
                        </div>

                        {editMode && (
                            <div className="mt-4">
                                <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                                    <PhotoIcon className="h-4 w-4 mr-1" />
                                    Add Images
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const newImages = files.map(file => URL.createObjectURL(file));
                                            setProfile({
                                                ...profile,
                                                gallery: [...(profile.gallery || []), ...newImages]
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}