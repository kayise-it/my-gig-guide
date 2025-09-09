import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import useAdminAPI from '../../hooks/useAdminAPI';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import OwnerSelector from '../../components/OwnerSelector';

const Venues = () => {
  const { venues: venueAPI, loading, error } = useAdminAPI();
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  // User search state for replacing legacy user_id field
  const [userQuery, setUserQuery] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const { isLoaded, loadError } = useGoogleMaps();
  const autocompleteRef = useRef(null);
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const address = place?.formatted_address;
      const location = place?.geometry?.location;
      setFormData(prev => ({
        ...prev,
        address: address || prev.address,
        latitude: location?.lat ? location.lat() : prev.latitude,
        longitude: location?.lng ? location.lng() : prev.longitude,
      }));
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    description: '',
    capacity: '',
    amenities: '',
    contact_info: '',
    user_id: '',
    owner_type: 'unclaimed',
    owner_id: '',
    latitude: '',
    longitude: ''
  });

  const columns = [
    {
      header: 'Venue',
      key: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.location}</div>
        </div>
      )
    },
    {
      header: 'Address',
      key: 'address',
      render: (value) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {value}
        </div>
      )
    },
    {
      header: 'Capacity',
      key: 'capacity',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {value} people
        </span>
      )
    },
    {
      header: 'Creator',
      key: 'creator',
      render: (value) => (
        <div>
          <div className="text-sm text-gray-900">{value?.username}</div>
          <div className="text-xs text-gray-500">{value?.email}</div>
        </div>
      )
    },
    {
      header: 'Created',
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const fetchVenues = async (page = 1, searchTerm = '') => {
    try {
      const response = await venueAPI.list({
        page,
        limit: 10,
        search: searchTerm
      });
      
      if (response.success) {
        setVenues(response.venues);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  useEffect(() => {
    fetchVenues(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreate = () => {
    setEditingVenue(null);
    setFormData({
      name: '',
      location: '',
      address: '',
      description: '',
      capacity: '',
      amenities: '',
      contact_info: '',
      user_id: '',
      owner_type: 'unclaimed',
      owner_id: '',
      latitude: '',
      longitude: ''
    });
    setUserQuery('');
    setUserOptions([]);
    setIsModalOpen(true);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      address: venue.address,
      description: venue.description,
      capacity: venue.capacity,
      amenities: venue.amenities,
      contact_info: venue.contact_info,
      user_id: venue.user_id,
      owner_type: venue.owner_type || 'unclaimed',
      owner_id: venue.owner_id || '',
      latitude: venue.latitude || '',
      longitude: venue.longitude || ''
    });
    setUserQuery('');
    setUserOptions([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (venue) => {
    if (window.confirm(`Are you sure you want to delete venue "${venue.name}"?`)) {
      try {
        await venueAPI.delete(venue.id);
        fetchVenues(currentPage, search);
      } catch (err) {
        console.error('Error deleting venue:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      // When unclaimed, clear owner fields
      if (!payload.owner_type || payload.owner_type === 'unclaimed') {
        delete payload.owner_id;
        payload.owner_type = null;
      }
      // Coerce coordinates to numbers if present
      if (payload.latitude !== '') payload.latitude = Number(payload.latitude);
      if (payload.longitude !== '') payload.longitude = Number(payload.longitude);
      if (editingVenue) {
        await venueAPI.update(editingVenue.id, payload);
      } else {
        await venueAPI.create(payload);
      }
      setIsModalOpen(false);
      fetchVenues(currentPage, search);
    } catch (err) {
      console.error('Error saving venue:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const OwnerTypeButton = ({ type, label, icon }) => (
    <button
      type="button"
      onClick={() => setFormData(prev => ({ ...prev, owner_type: type }))}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition ${formData.owner_type === type ? 'border-yellow-600 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  // Debounced user search (simple)
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const run = async () => {
      const q = userQuery.trim();
      if (q.length < 2) { setUserOptions([]); return; }
      try {
        setIsSearchingUsers(true);
        // Reuse venueAPI's base client via useAdminAPI by calling users list endpoint
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/admin/users?limit=7&page=1&search=${encodeURIComponent(q)}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('majesty_token') || ''}` },
          signal: controller.signal
        });
        const data = await res.json();
        if (!active) return;
        if (data && data.success) {
          const options = (data.users || []).map(u => ({ id: u.id, label: `${u.username || u.email} · ${u.email}` }));
          setUserOptions(options);
        } else {
          setUserOptions([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setUserOptions([]);
        }
      } finally {
        if (active) setIsSearchingUsers(false);
      }
    };
    const t = setTimeout(run, 300);
    return () => { active = false; controller.abort(); clearTimeout(t); };
  }, [userQuery]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
            <p className="text-gray-600">Manage venue listings and information</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add New Venue
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          data={venues}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search venues..."
          entityName="venues"
        />

        {/* Create/Edit Modal */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingVenue ? 'Edit Venue' : 'Create New Venue'}
          onSubmit={handleSubmit}
          loading={loading}
        >
          <div className="space-y-4">
            {/* Owner type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <OwnerTypeButton type="artist" label="Artist" icon={<span>🎤</span>} />
                <OwnerTypeButton type="organiser" label="Organiser" icon={<span>🏢</span>} />
                <OwnerTypeButton type="user" label="User" icon={<span>👤</span>} />
                <OwnerTypeButton type="unclaimed" label="Unclaimed" icon={<span>🗂️</span>} />
              </div>
              {formData.owner_type !== 'unclaimed' && (
                <div className="mt-3">
                  <OwnerSelector
                    ownerType={formData.owner_type}
                    value={formData.owner_id}
                    onSelect={(id) => setFormData(prev => ({ ...prev, owner_id: id }))}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Venue Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {loadError && (
                <div className="text-red-500 text-sm mb-2">Google Maps failed to load. Please refresh.</div>
              )}
              {isLoaded ? (
                <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Start typing address..."
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Loading Google Maps..."
                  required
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* User picker (replaces legacy user_id) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Creator User <span className="text-gray-500 text-sm">(Optional)</span></label>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search by username or email..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
              {userOptions.length > 0 && (
                <div className="mt-2 max-h-48 overflow-auto border border-gray-200 rounded-md divide-y bg-white shadow-sm">
                  {userOptions.map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => { setFormData(prev => ({ ...prev, user_id: opt.id })); setUserQuery(opt.label); setUserOptions([]); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${formData.user_id === opt.id ? 'bg-yellow-50' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {isSearchingUsers && <div className="text-xs text-gray-500 mt-1">Searching...</div>}
              {formData.user_id && (
                <p className="text-xs text-gray-600 mt-1">Selected user ID: {formData.user_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Info</label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                rows={2}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default Venues;


