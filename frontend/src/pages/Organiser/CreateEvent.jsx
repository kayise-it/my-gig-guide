// file: frontend/src/pages/organiser/dashboard/events/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import DynamicEventButton from '../../components/Includes/DynamicEventButton';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import PageHeader from '../../components/Includes/PageHeader';
import API_BASE_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useVenueModal } from "../../components/Venue/VenueModalContext";
import OrganiserPosterUpload from '../../components/Events/OrganiserPosterUpload';
import GalleryUploader from '../../components/Events/GalleryUploader';
import { venueService } from '../../api/venueService'; // You'll need to implement these API functions

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { openVenueModal } = useVenueModal();
  const artistId = currentUser.artist_id || location.state?.artistId; // Get artist ID from state if it exists
  const organiserId = currentUser.organiser_id || location.state?.organiserId; // Get organiser ID from state if it exists
  const { id } = useParams(); // Get event ID from URL if it exists
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const [formData, setFormData] = useState({
    userId: userId || artistId || null,
    organiser_id: organiserId || null,
    venue_id: '',
    name: '',
    description: '',
    date: '',
    time: '',
    price: '',
    ticket_url: '',
    poster: '',
    booked_artists: '',
    category: '',
    capacity: '',
    gallery: [],
  });
  


  const { id: eventId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [venues, setVenues] = useState({});
  const [organiser, setOrganiser] = useState({});
  const [apiError, setApiError] = useState(null);
  const token = localStorage.getItem('token'); // or wherever your token is stored
  const [organiserSettings, setOrganiserSettings] = useState({});
  const [user, setUser] = useState(null);
  const [orgFolder, setOrgFolder] = useState('');
  const [posterFileName, setPosterFileName] = useState('');

  const handlePosterSave = (fileName) => {
    const newpath = orgFolder.replace('../frontend/public', '');
    //alert("Poster file saved: " + newpath+"/"+fileName);
    setPosterFileName(newpath+"/"+fileName); // ✅ Update posterFileName with full path

    setFormData((prev) => ({
      ...prev,
      poster: newpath+"/"+fileName, // ✅ Update formData.poster
    }));
  };

  // Fetch events after user is loaded
  useEffect(() => {
    axios.get(`http://localhost:8000/api/organisers/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const parsedSettings = JSON.parse(response.data.settings);

        setOrganiser(response.data);
        setOrganiserSettings(parsedSettings);
        setOrgFolder(parsedSettings.path + parsedSettings.folder_name); // ✅ Use it directly
      })
      .catch((err) => {
        console.error("Failed to fetch organiser", err);
      });
  }, [user]); // Depends on user state

  useEffect(() => {
    // If ID exists, fetch the event details and populate form
    if (id) {
      fetchEventDetails();
    }
    fetchVenues();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const event = response.data.event;
      setFormData({
        userId: parseInt(event.userId, 10),
        name: event.name,
        description: event.description,
        date: event.date.split("T")[0], // Extract date part only
        time: event.time,
        price: event.price || '',
        ticket_url: event.ticket_url || '',
        booked_artists: event.booked_artists || '',
        category: event.category || '',
        capacity: event.capacity || '',
        venue_id: 0,
        poster: event.poster || null,
        gallery: event.gallery ? event.gallery.split(',') : [],
        latitude: event.latitude || '',
        longitude: event.longitude || '',
        organiser_id: event.organiser_id || null,
      });
    } catch (error) {
      console.error("Failed to load event data:", error);
      setApiError("Failed to load event data.");
    }
  };

  const fetchVenues = async () => {
    /* Try to get the vunues for this currentUser.id */
    try {
      const response = await venueService.getOrganisersVenues(userId);
      console.log("API re34sponse:", response);
      setVenues(response || []);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setApiError("Failed to fetch venues.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (posterFileName) {
      setFormData((prev) => ({
        ...prev,
        poster: posterFileName,
      }));
    }

    setIsSubmitting(true);

    console.log("Form data before submission:", formData);
    try {
      //if artistId is set
      let eventData = {};

      console.log("posterFileName:", posterFileName);
      eventData = {
        userId: formData.userId,
        organiser_id: formData.organiser_id,
        venue_id: formData.venue_id,
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        price: formData.price || null,
        ticket_url: formData.ticket_url || null,
        poster: posterFileName || null,
        booked_artists: formData.booked_artists || null,
        category: formData.category || null,
        capacity: formData.capacity || null,
        gallery: formData.gallery.join(','),
      };
      let response;
      if (id) {
        // edit existing event
        response = await axios.put(`${API_BASE_URL}/api/events/edit/${id}`, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Eveupdated successfully:', response);
      } else {
        // 

        response = await axios.post(`${API_BASE_URL}/api/events/create_event`, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('099009209023902392309:' + JSON.stringify(eventData));
      }

      navigate(`/${currentUser.aclInfo.acl_name}/dashboard/event/${response.data.eventId}`);
    } catch (error) {
      console.error('Event submission error:', error);
      setApiError(error.response?.data?.message || 'Failed to submit event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: `/${currentUser.aclInfo.acl_name}/dashboard` },
    { label: `Create Event`, path: `${currentUser.aclInfo.acl_name}/dashboard/organisation-profile` },
  ];


  return (

    <div className="min-h-screen bg-gray-50">
      <PageHeader HeaderName="Create New Event" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-stretch w-full">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-8000 mb-4">Basic Information</h2>
              <input type="hidden" name="artist_id" value={artistId} />
              <input type="hidden" name="organiser_id" value={organiserId} />
              <div className="grid grid-cols-3 gap-6 bg-slate-100 p-6 rounded">
                <div className="">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div className="">
                  <div className="">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  </div>
                </div>

                <div className="">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.time ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-slate-100 p-6 rounded ">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

            </div>

            {/* Venue Details */}
            <div className="bg-slate-100 rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-6 text-gray-8000">Event Venue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">

                {/* Vunue Card */}
                {/* Each venue will be a radio but with the same name, and using venue_id as the value */}
                {venues && venues.length > 0 ? (
                  venues
                    .filter(v => v && v.id) // prevent undefined/null or missing id
                    .map(venue => (
                      <label className="flex items-center space-x-2 mb-2" key={venue.id}>
                        <input
                          type="radio"
                          name="venue_id"
                          value={venue.id}
                          checked={formData.venue_id === venue.id}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              venue_id: venue.id
                            }))
                          }
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="font-medium">{venue.name}</span>
                      </label>
                    ))
                ) : (
                  <div className="text-gray-500 space-y-2">
                    <p>No venues found. Please create a venue first.</p>
                  </div>
                )}


              </div>
            </div>

            {/* Event Details */}
            <div className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-8000">Event Details</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    min="0"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="conference">Conference</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="ticket_url" className="block text-sm font-medium text-gray-700">
                    Ticket URL
                  </label>
                  <input
                    type="url"
                    name="ticket_url"
                    id="ticket_url"
                    value={formData.ticket_url}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/tickets"
                  />
                </div>

               {/*  <div className="sm:col-span-3">
                  <label htmlFor="booked_artists" className="block text-sm font-medium text-gray-700">
                    Booked Artists
                  </label>
                  <input
                    type="text"
                    name="booked_artists"
                    id="booked_artists"
                    value={formData.booked_artists}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Artist 1, Artist 2, ..."
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate multiple artists with commas</p>
                </div> */}
              </div>
            </div>

            {/* Media Uploads */}
            <div className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Event Media</h2>

              <div className="grid grid-cols-6 gap-6 sm:grid-cols-6">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Event Poster</label>
                  <OrganiserPosterUpload
                    onSave={handlePosterSave}
                    orgFolder={orgFolder} />
                </div>
{/* 
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Event Gallery</label>
                  <div className="mt-1 flex justify-center border-2 border-gray-300 border-dashed rounded-md">
                    <div>
                      <GalleryUploader
                        onSave={handlePosterSave}
                        orgFolder={orgFolder} />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/organiser/dashboard/events')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <DynamicEventButton isSubmitting={isSubmitting} isEditing={!!eventId} />

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;