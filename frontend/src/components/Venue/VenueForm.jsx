// src/components/Venue/VenueForm.jsx
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { venueService } from '../../api/venueService'; // You'll need to implement these API functions
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const VenueForm = ({ isModal = false, onSuccess, onClose }) => {
  const { venueId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const libraries = ['places'];
  const googleMapsApiKey = 'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y'; // your API key
  const autocompleteRef = useRef(null);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const address = place.formatted_address;
      const location = place.geometry?.location;

      setFormData(prev => ({
        ...prev,
        address: address || '',
        latitude: location?.lat() || '',
        longitude: location?.lng() || '',
      }));
    }
  };
  // Fetch user info on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

  }, []);
  let initialFormData = {
    name: '',
    location: '',
    capacity: '',
    contact_email: '',
    phone_number: '',
    website: '',
    address: '',
    latitude: '',
    longitude: '',
    userId: currentUser.id,
  };
  if (currentUser.organiser_id) {
    initialFormData.organiser_id = currentUser.organiser_id;
  } else if (currentUser.artist_id) {
    initialFormData.artist_id = currentUser.artist_id;
  }

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (venueId) {
      setIsEditMode(true);
      fetchVenue();
    }
  }, [venueId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchVenue = async () => {
    try {
      setIsLoading(true);
      const venue = await venueService.getVenue(venueId);
      setFormData({
        name: venue.name,
        location: venue.location,
        capacity: venue.capacity,
        contact_email: venue.contact_email,
        phone_number: venue.phone_number,
        website: venue.website,
        address: venue.address,
        latitude: venue.latitude,
        longitude: venue.longitude,
      });
    } catch (error) {
      console.error('Error fetching venue:', error);
      setErrors(prev => ({
        ...prev,
        server: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error if user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const venueData = {
        ...formData,
        capacity: Number(formData.capacity),
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
      };

      let result;
      if (isEditMode) {
        result = await venueService.updateVenue(venueId, venueData);
      } else {
        result = await venueService.createVenue(venueData);
      }

      if (onSuccess) {
        onSuccess(result);
      } else if (!isModal) {
        navigate(`/venue/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving venue:', error);
      setErrors(prev => ({
        ...prev,
        server: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading && isEditMode) {
    return <div className="text-center py-8">Loading venue data...</div>;
  }

  return (
    <div className={`${isModal ? '' : 'max-w-3xl mx-auto p-6'}`}>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Venue' : 'Create New Venue'}
        </h2>
      )}

      {errors.server && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.server}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <input type="hidden" name="userId" value={currentUser.id} />
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Venue Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Description of premisis *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Capacity */}
          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-medium mb-1">
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
          </div>

          {/* Contact Email */}
          <div className="mb-4">
            <label htmlFor="contact_email" className="block text-sm font-medium mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.contact_email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Website */}
          <div className="mb-4">
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Address */}
          <div className="mb-4 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address *
            </label>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
              <Autocomplete
                onLoad={(autoC) => (autocompleteRef.current = autoC)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Start typing address..."
                  className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
              </Autocomplete>
            </LoadScript>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Latitude & Longitude */}
          <div className="mb-4">
            <label htmlFor="latitude" className=" text-sm font-medium mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="longitude" className=" text-sm font-medium mb-1 ">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded "
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {isModal && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Venue' : 'Creaete Venue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenueForm;