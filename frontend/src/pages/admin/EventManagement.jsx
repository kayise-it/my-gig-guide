import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import CRUDModal from '../../components/admin/CRUDModal';
import useAdminData from '../../hooks/useAdminData';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const EventManagement = () => {
  const { showSuccess, showError } = useToast();
  const { fetchEntityData } = useAdminData();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    description: '',
    date: '',
    time: '',
    venueId: '',
    price: '',
    status: 'scheduled'
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchEvents = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/events`, {
        headers: getAuthHeaders(),
        params: { page, limit: 10, search }
      });

      if (response.data.success) {
        setEvents(response.data.events);
        setPagination(response.data.pagination);
      } else {
        showError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders(),
        params: { limit: 1000 }
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/venues`, {
        headers: getAuthHeaders(),
        params: { limit: 1000 }
      });

      if (response.data.success) {
        setVenues(response.data.venues);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage, searchTerm);
    fetchUsers();
    fetchVenues();
  }, [currentPage, searchTerm]);

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      userId: '',
      name: '',
      description: '',
      date: '',
      time: '',
      venueId: '',
      price: '',
      status: 'scheduled'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      userId: event.userId,
      name: event.name,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time || '',
      venueId: event.venueId || '',
      price: event.price || '',
      status: event.status || 'scheduled'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Are you sure you want to delete event "${event.name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/events/${event.id}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        showSuccess('Event deleted successfully');
        fetchEvents(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      showError('Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = editingEvent
        ? await axios.put(`${API_BASE_URL}/api/admin/events/${editingEvent.id}`, formData, {
            headers: getAuthHeaders()
          })
        : await axios.post(`${API_BASE_URL}/api/admin/events`, formData, {
            headers: getAuthHeaders()
          });

      if (response.data.success) {
        showSuccess(editingEvent ? 'Event updated successfully' : 'Event created successfully');
        setIsModalOpen(false);
        fetchEvents(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      showError('Failed to save event');
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true
    },
    {
      key: 'name',
      title: 'Event Name',
      sortable: true
    },
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      key: 'time',
      title: 'Time',
      sortable: true
    },
    {
      key: 'venue',
      title: 'Venue',
      sortable: false,
      render: (venue) => venue ? venue.name : 'N/A'
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (price) => price ? `$${price}` : 'Free'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    }
  ];

  const formFields = [
    {
      name: 'userId',
      label: 'Creator',
      type: 'select',
      required: true,
      options: users.map(user => ({ value: user.id, label: `${user.username} (${user.email})` }))
    },
    {
      name: 'name',
      label: 'Event Name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true
    },
    {
      name: 'time',
      label: 'Time',
      type: 'time',
      required: false
    },
    {
      name: 'venueId',
      label: 'Venue',
      type: 'select',
      required: false,
      options: [{ value: '', label: 'No Venue' }, ...venues.map(venue => ({ value: venue.id, label: venue.name }))]
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: false,
      placeholder: 'Leave empty for free event'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600">Manage events and bookings</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Event
            </button>
          </div>
        </div>

        <DataTable
          data={events}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search events..."
          title="Events"
        />

        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingEvent ? 'Edit Event' : 'Create Event'}
          formData={formData}
          setFormData={setFormData}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default EventManagement;

