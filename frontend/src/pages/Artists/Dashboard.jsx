//File path: frontend/src/pages/Artists/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, PencilIcon, MusicalNoteIcon, LinkIcon, UserIcon, PhoneIcon, CalendarIcon, MapPinIcon, UsersIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import PageHeader from '../../components/Includes/PageHeader';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import { Link } from 'react-router-dom';
import ArtistProfileCard from '../../components/Artist/ArtistProfileCard';
import ArtistQuickActions from '../../components/Artist/ArtistQuickActions';
import ArtistUpcomingEvents from '../../components/Artist/ArtistUpcomingEvents';
import ArtistVenuesSection from '../../components/Artist/ArtistVenuesSection';
import ArtistPreviousEvents from '../../components/Artist/ArtistPreviousEvents';
import ArtistViewProfile from '../../components/Artist/ArtistViewProfile';
import ArtistEditForm from '../../components/Artist/ArtistEditForm';
import API_BASE_URL from '../../api/config';

export default function ArtistDashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [artistSettings, setArtistSettings] = useState({});
  const [state, setState] = useState({
    isProfileModalOpen: false,
    artistData: null,
    artistEvents: [],
    artistActiveEvents: [],
    artistVenues: [],
    loading: true,
    error: null,
    editMode: false
  });
  const [artistData, setArtistData] = useState({
    id: 0,
    userId: 0,
    stage_name: '',
    real_name: '',
    genre: '',
    bio: '',
    phone_number: '',
    instagram: '',
    facebook: '',
    twitter: '',
    profile_picture: null
  });
  const [artistEvents, setArtistEvents] = useState([]);
  const [artistActiveEvents, setArtistActiveEvents] = useState([]);
  const [artistVenues, setArtistVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const handleSaveModalProfilePicture = async (file) => {
    try {
      await handleProfilePicUpload(file);
      setIsProfileModalOpen(false); // Close modal on successful upload
    } catch (error) {
      // Error is already logged by handleProfilePicUpload
      // You might want to show a notification to the user here
      console.error("Failed to upload from modal:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever your token is stored
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not found');

        const [artistRes, eventsRes, activeEventsRes, venuesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/artists/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/events_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/events_active_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/venues_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const { artist } = artistRes.data;
        if (artist.settings) {
          try {
            const parsedSettings = typeof artist.settings === 'string'
              ? JSON.parse(artist.settings)
              : artist.settings;

            setArtistSettings(parsedSettings);
          } catch (error) {
            console.error("Failed to parse artist settings:", error);
          }
        }

        setArtistData(artist);
        setArtistEvents(eventsRes.data);
        setArtistActiveEvents(activeEventsRes.data);
        setArtistVenues(venuesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //uploadProfilePic We have set up a directory structure for uploading profile pictures. The folder path is “uploads/artist/{id}_{name}”, where {id} is the artist’s unique ID, and {name} is the artist’s name. Uploaded images are stored in this directory.
  const handleProfilePicUpload = async (imageFile) => {
  try {
    const formData = new FormData();

    formData.append("profile_picture", imageFile); // ✅ Use the actual file object
    formData.append("setting_name", artistSettings.setting_name);
    formData.append("path", artistSettings.path);
    formData.append("folder_name", artistSettings.folder_name);
    formData.append("propic", artistSettings.setting_name);

    const response = await axios.put(
      `${API_BASE_URL}/api/artists/uploadprofilepicture/${artistData.userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

        console.log("Upload response:", response.data);

        // ✅ Update artistData with new profile picture (this triggers re-render)
    if (response.status === 200) {
      setArtistData((prev) => ({
        ...prev,
        profile_picture: response.data.path
      }));
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios.put(`${API_BASE_URL}/api/artists/edit/${userId}`, artistData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating artist data:', error);
      setError('Failed to update profile');
    }
  };
  const breadcrumbs = [
    { label: 'Dashboard', path: '/artist/dashboard' },
    { label: artistData?.stage_name, path: '/artist/dashboard/profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader HeaderName="Artist Dashboard" />
        <div className="max-w-7xl mx-auto">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader HeaderName="Artist Dashboard" />
        <div className="max-w-7xl mx-auto">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader HeaderName="Artist Dashboard" />
      <div className="max-w-7xl mx-auto">
        <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ArtistProfileCard
              artistData={artistData}
              editMode={editMode}
              onEditToggle={() => setEditMode(!editMode)}
              isProfileModalOpen={isProfileModalOpen}
              onProfileModalClose={() => setIsProfileModalOpen(false)}
              onProfileModalOpen={() => setIsProfileModalOpen(true)}
              artistSettings={artistSettings}
              onSaveProfilePicture={handleSaveModalProfilePicture}
            />

            {/* Profile Details Section */}
            {editMode ? (
              <ArtistEditForm
                artistData={artistData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => setState(prev => ({ ...prev, editMode: false }))}
              />
            ) : (
              <ArtistViewProfile artistData={artistData} />
            )}
            <ArtistVenuesSection venues={artistVenues} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ArtistQuickActions artistId={artistData?.userId} />
            <ArtistUpcomingEvents events={artistActiveEvents} />

            <ArtistPreviousEvents events={artistEvents} />
          </div>
        </div>
      </div>
    </div>
  );

}