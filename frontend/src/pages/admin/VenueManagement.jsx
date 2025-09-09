import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import CRUDModal from '../../components/admin/CRUDModal';
import useAdminData from '../../hooks/useAdminData';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const VenueManagement = () => {
  const { showSuccess, showError } = useToast();
  const { fetchEntityData } = useAdminData();
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    location: '',
    address: '',
    capacity: '',
    description: '',
    amenities: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchVenues = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/venues`, {
        headers: getAuthHeaders(),
        params: { page, limit: 10, search }
      });

      if (response.data.success) {
        setVenues(response.data.venues);
        setPagination(response.data.pagination);
      } else {
        showError('Failed to fetch venues');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      showError('Failed to fetch venues');
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

  useEffect(() => {
    fetchVenues(currentPage, searchTerm);
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setEditingVenue(null);
    setFormData({
      userId: '',
      name: '',
      location: '',
      address: '',
      capacity: '',
      description: '',
      amenities: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      userId: venue.userId,
      name: venue.name,
      location: venue.location,
      address: venue.address,
      capacity: venue.capacity,
      description: venue.description,
      amenities: venue.amenities
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (venue) => {
    if (!window.confirm(`Are you sure you want to delete venue "${venue.name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/venues/${venue.id}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        showSuccess('Venue deleted successfully');
        fetchVenues(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to delete venue');
      }
    } catch (error) {
      console.error('Error deleting venue:', error);
      showError('Failed to delete venue');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = editingVenue
        ? await axios.put(`${API_BASE_URL}/api/admin/venues/${editingVenue.id}`, formData, {
            headers: getAuthHeaders()
          })
        : await axios.post(`${API_BASE_URL}/api/admin/venues`, formData, {
            headers: getAuthHeaders()
          });

      if (response.data.success) {
        showSuccess(editingVenue ? 'Venue updated successfully' : 'Venue created successfully');
        setIsModalOpen(false);
        fetchVenues(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to save venue');
      }
    } catch (error) {
      console.error('Error saving venue:', error);
      showError('Failed to save venue');
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
      title: 'Name',
      sortable: true
    },
    {
      key: 'location',
      title: 'Location',
      sortable: true
    },
    {
      key: 'address',
      title: 'Address',
      sortable: true
    },
    {
      key: 'capacity',
      title: 'Capacity',
      sortable: true
    },
    {
      key: 'creator',
      title: 'Creator',
      sortable: false,
      render: (creator) => creator ? `${creator.username} (${creator.email})` : 'N/A'
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
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
      label: 'Venue Name',
      type: 'text',
      required: true
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false
    },
    {
      name: 'amenities',
      label: 'Amenities',
      type: 'textarea',
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
              <p className="text-gray-600">Manage venue listings and information</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Venue
            </button>
          </div>
        </div>

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
          title="Venues"
        />

        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingVenue ? 'Edit Venue' : 'Create Venue'}
          formData={formData}
          setFormData={setFormData}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default VenueManagement;

