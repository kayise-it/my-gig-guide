// file: frontend/src/pages/guider/dashboard/events/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  CheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  CameraIcon,
  XMarkIcon,
  PlusIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import DynamicEventButton from '../../components/Includes/DynamicEventButton';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import PageHeader from '../../components/Includes/PageHeader';
import API_BASE_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useVenueModal } from "../../components/Venue/VenueModalContext";
import SimplePosterUpload from '../../components/Events/SimplePosterUpload';
import SimpleGalleryUpload from '../../components/Events/SimpleGalleryUpload';
import { venueService } from '../../api/venueService';
import { eventService } from '../../api/eventService.js';
import VenueSelector from '../../components/Venue/VenueSelector';
import { notificationService } from '../../services/notificationService';

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { openVenueModal } = useVenueModal();
  const { id } = useParams(); // Get event ID from URL if it exists
  const userId = currentUser?.id;
  
  // For users, owner_id is the user's own ID, owner_type is 'user'
  const [formData, setFormData] = useState({
    userId: userId,
    owner_id: userId, // User owns their own events
    owner_type: 'user', // User type
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
  const [guider, setGuider] = useState({});
  const [apiError, setApiError] = useState(null);
  const token = localStorage.getItem('token'); // or wherever your token is stored
  const [organiserSettings, setGuiderSettings] = useState({});
  const [user, setUser] = useState(null);
  const [orgFolder, setOrgFolder] = useState('');
  const [selectedPosterFile, setSelectedPosterFile] = useState(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [posterPreview, setPosterPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePosterSelect = (file) => {
    setSelectedPosterFile(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGallerySelect = (files) => {
    setSelectedGalleryFiles(files);
    // Create previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePoster = () => {
    setSelectedPosterFile(null);
    setPosterPreview('');
  };

  const removeGalleryFile = (index) => {
    const newFiles = selectedGalleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setSelectedGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  // Step configuration
  const steps = [
    { 
      number: 1, 
      title: 'Basic Info', 
      description: 'Event name, date & time',
      icon: CalendarDaysIcon,
      fields: ['name', 'date', 'time']
    },
    { 
      number: 2, 
      title: 'Venue & Details', 
      description: 'Location and event details',
      icon: MapPinIcon,
      fields: ['venue_id', 'description', 'category']
    },
    { 
      number: 3, 
      title: 'Pricing & Tickets', 
      description: 'Price, capacity & ticketing',
      icon: TicketIcon,
      fields: ['price', 'capacity', 'ticket_url']
    },
    { 
      number: 4, 
      title: 'Media', 
      description: 'Poster and gallery images',
      icon: CameraIcon,
      fields: ['poster', 'gallery']
    }
  ];

  // Step navigation
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // Prevent Enter key from submitting before final step
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep < steps.length) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep - 1];
    const stepErrors = {};
    
    currentStepData.fields.forEach(field => {
      if (field === 'name' && !formData.name.trim()) {
        stepErrors.name = 'Event name is required';
      }
      if (field === 'date' && !formData.date) {
        stepErrors.date = 'Event date is required';
      }
      if (field === 'date' && formData.date) {
        // Validate that event date is not in the past
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        if (selectedDate < today) {
          stepErrors.date = 'Event date cannot be in the past';
        }
      }
      if (field === 'time' && !formData.time) {
        stepErrors.time = 'Event time is required';
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Check if step is completed
  const isStepCompleted = (stepNumber) => {
    const stepData = steps[stepNumber - 1];
    return stepData.fields.every(field => {
      if (field === 'name') return formData.name.trim();
      if (field === 'date') return formData.date;
      if (field === 'time') return formData.time;
      // Optional fields
      return true;
    });
  };

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        let fetchedUser = null;
        if (storedUser?.id) {
          const userResponse = await axios.get(`${API_BASE_URL}/api/auth/${storedUser.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchedUser = userResponse.data;
          setUser(fetchedUser);
        }

        // Venues are now fetched by VenueSelector component

        // If editing an existing event, fetch event details
        if (id) {
          await fetchEventDetails();
        }

        // Set user folder path
        const username = fetchedUser?.username || storedUser?.username || currentUser?.username;
        if (userId && username) {
          setUserFolder(`public/users/${userId}_${username}`);
        }

      } catch (error) {
        console.error('Error initializing component:', error);
        setApiError('Failed to load component data');
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [id, token, currentUser, organiserId, artistId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const eventData = response.data.event;
      setFormData({
        userId: eventData.userId,
        owner_id: eventData.owner_id,
        owner_type: eventData.owner_type,
        venue_id: eventData.venue_id || '',
        name: eventData.name || '',
        description: eventData.description || '',
        date: eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '',
        time: eventData.time || '',
        price: eventData.price || '',
        ticket_url: eventData.ticket_url || '',
        poster: eventData.poster || '',
        booked_artists: eventData.booked_artists || '',
        category: eventData.category || '',
        capacity: eventData.capacity || '',
        gallery: eventData.gallery ? eventData.gallery.split(',') : [],
      });
      
      if (eventData.poster) {
        setPosterPreview(`${API_BASE_URL}${eventData.poster}`);
      }
      if (eventData.gallery) {
        setGalleryPreviews(eventData.gallery.split(',').map(path => `${API_BASE_URL}${path}`));
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setApiError('Failed to load event details');
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
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.owner_id) newErrors.owner_id = 'Owner ID is required';
    if (!formData.owner_type) newErrors.owner_type = 'Owner type is required';
    
    // Validate that event date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    // If not on the last step, advance instead of submitting
    if (currentStep < steps.length) {
      if (validateCurrentStep()) {
        nextStep();
      }
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add basic event data
      formDataToSend.append('userId', formData.userId);
      formDataToSend.append('owner_id', formData.owner_id);
      formDataToSend.append('owner_type', formData.owner_type);
      formDataToSend.append('venue_id', formData.venue_id || '');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('price', formData.price || '');
      formDataToSend.append('ticket_url', formData.ticket_url || '');
      formDataToSend.append('booked_artists', formData.booked_artists || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('capacity', formData.capacity || '');
      
      // Do not send orgFolder; backend derives correct folder from profile settings

      // Add poster file if selected
      if (selectedPosterFile) {
        formDataToSend.append('poster', selectedPosterFile);
      }

      // Add gallery files if selected
      if (selectedGalleryFiles.length > 0) {
        selectedGalleryFiles.forEach(file => {
          formDataToSend.append('gallery', file);
        });
      }

      let response;
      if (id) {
        // edit existing event
        response = await axios.put(`${API_BASE_URL}/api/events/edit/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Event updated successfully:', response);
      } else {
        // create new event
        response = await axios.post(`${API_BASE_URL}/api/events/create_event`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Event created successfully:', currentUser.aclInfo.acl_name);
      }

      navigate(`/user/dashboard/event/${response.data.eventId}`);
    } catch (error) {
      console.error('Event submission error:', error);
      setApiError(error.response?.data?.message || 'Failed to submit event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/user/dashboard' },
    { label: 'Create Event', path: '/user/dashboard/create-event' },
  ];


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with the essential details of your event</p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-lg`}
                  placeholder="Enter your event name"
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={`w-full px-4 py-3 border ${errors.date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
                  <p className="mt-1 text-sm text-gray-500">Events can only be scheduled for today or future dates</p>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.time ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {errors.time && <p className="mt-2 text-sm text-red-600">{errors.time}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <MapPinIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Venue & Details</h2>
              <p className="text-gray-600">Choose your venue and add event details</p>
            </div>

                        <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Select Venue
                </label>
                <VenueSelector
                  selectedVenueId={formData.venue_id}
                  onVenueSelect={(venueId) => {
                    setFormData(prev => ({ ...prev, venue_id: venueId }));
                  }}
                  userRole="user"
                  userId={userId}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Select category</option>
                  <option value="live_music">Live Music</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                  <option value="conference">Conference</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="booked_artists" className="block text-sm font-semibold text-gray-900 mb-2">
                  Booked Artists
                </label>
                <input
                  type="text"
                  name="booked_artists"
                  id="booked_artists"
                  value={formData.booked_artists}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter artist names separated by commas"
                />
                <p className="mt-1 text-sm text-gray-600">
                  List the artists performing at this event (e.g., "John Doe, Jane Smith")
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <TicketIcon className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Tickets</h2>
              <p className="text-gray-600">Set your pricing and ticketing details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Ticket Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">R</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-semibold text-gray-900 mb-2">
                  <UsersIcon className="inline h-4 w-4 mr-1" />
                  Event Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  id="capacity"
                  min="0"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Maximum attendees"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ticket_url" className="block text-sm font-semibold text-gray-900 mb-2">
                Ticket Purchase URL
              </label>
              <input
                type="url"
                name="ticket_url"
                id="ticket_url"
                value={formData.ticket_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://example.com/tickets"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CameraIcon className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Media</h2>
              <p className="text-gray-600">Add visual content to showcase your event</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Poster</h3>
                <SimplePosterUpload
                  onFileSelect={handlePosterSelect}
                  selectedFile={selectedPosterFile}
                  posterPreview={posterPreview}
                  onRemove={removePoster}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Gallery</h3>
                <SimpleGalleryUpload
                  onFilesSelect={handleGallerySelect}
                  selectedFiles={selectedGalleryFiles}
                  galleryPreviews={galleryPreviews}
                  onRemoveFile={removeGalleryFile}
                />
              </div>
            </div>

            {(selectedPosterFile || selectedGalleryFiles.length > 0) && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-900 mb-4">Media Summary</h3>
                <div className="space-y-2">
                  {selectedPosterFile && (
                    <div className="flex items-center text-sm text-indigo-800">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Event poster selected: {selectedPosterFile.name}
                    </div>
                  )}
                  {selectedGalleryFiles.length > 0 && (
                    <div className="flex items-center text-sm text-indigo-800">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      {selectedGalleryFiles.length} gallery image{selectedGalleryFiles.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <PageHeader HeaderName={`Create New Event - ${currentUser.aclInfo.acl_name === 'artist' ? 'Artist' : 'Organiser'}`} />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create Your Event</h2>
            <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = completedSteps.has(step.number) || isStepCompleted(step.number);
              const isAccessible = step.number <= currentStep || isCompleted;

              return (
                <div key={step.number} className="flex items-center">
                  <button
                    onClick={() => isAccessible && goToStep(step.number)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                        : isCompleted
                        ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : isAccessible
                        ? 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300 hover:shadow-md'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-purple-600' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 ml-4 mr-4 hidden sm:block">
                      <div className={`h-1 rounded-full ${isCompleted ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'}`} />
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div role="form" onKeyDown={handleFormKeyDown} className="bg-white rounded-2xl shadow-xl p-8">
                  <input type="hidden" name="user_id" value={userId} />
          
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
                >
                  Next
                  <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {id ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      {id ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;