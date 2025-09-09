import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import CRUDModal from '../../components/admin/CRUDModal';
import useAdminData from '../../hooks/useAdminData';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const OrganiserManagement = () => {
  const { showSuccess, showError } = useToast();
  const { fetchEntityData } = useAdminData();
  const [organisers, setOrganisers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganiser, setEditingOrganiser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    contact_email: '',
    phone_number: '',
    description: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchOrganisers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/organisers`, {
        headers: getAuthHeaders(),
        params: { page, limit: 10, search }
      });

      if (response.data.success) {
        setOrganisers(response.data.organisers);
        setPagination(response.data.pagination);
      } else {
        showError('Failed to fetch organisers');
      }
    } catch (error) {
      console.error('Error fetching organisers:', error);
      showError('Failed to fetch organisers');
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
    fetchOrganisers(currentPage, searchTerm);
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
    setEditingOrganiser(null);
    setFormData({
      userId: '',
      name: '',
      contact_email: '',
      phone_number: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (organiser) => {
    setEditingOrganiser(organiser);
    setFormData({
      userId: organiser.userId,
      name: organiser.name,
      contact_email: organiser.contact_email,
      phone_number: organiser.phone_number,
      description: organiser.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (organiser) => {
    if (!window.confirm(`Are you sure you want to delete organiser "${organiser.name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/organisers/${organiser.id}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        showSuccess('Organiser deleted successfully');
        fetchOrganisers(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to delete organiser');
      }
    } catch (error) {
      console.error('Error deleting organiser:', error);
      showError('Failed to delete organiser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = editingOrganiser
        ? await axios.put(`${API_BASE_URL}/api/admin/organisers/${editingOrganiser.id}`, formData, {
            headers: getAuthHeaders()
          })
        : await axios.post(`${API_BASE_URL}/api/admin/organisers`, formData, {
            headers: getAuthHeaders()
          });

      if (response.data.success) {
        showSuccess(editingOrganiser ? 'Organiser updated successfully' : 'Organiser created successfully');
        setIsModalOpen(false);
        fetchOrganisers(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to save organiser');
      }
    } catch (error) {
      console.error('Error saving organiser:', error);
      showError('Failed to save organiser');
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
      key: 'contact_email',
      title: 'Contact Email',
      sortable: true
    },
    {
      key: 'phone_number',
      title: 'Phone',
      sortable: true
    },
    {
      key: 'user',
      title: 'User',
      sortable: false,
      render: (user) => user ? `${user.username} (${user.email})` : 'N/A'
    },
    {
      key: 'createdDate',
      title: 'Created',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  const formFields = [
    {
      name: 'userId',
      label: 'User',
      type: 'select',
      required: true,
      options: users.map(user => ({ value: user.id, label: `${user.username} (${user.email})` }))
    },
    {
      name: 'name',
      label: 'Organisation Name',
      type: 'text',
      required: true
    },
    {
      name: 'contact_email',
      label: 'Contact Email',
      type: 'email',
      required: true
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'text',
      required: false
    },
    {
      name: 'description',
      label: 'Description',
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
              <h1 className="text-2xl font-bold text-gray-900">Organiser Management</h1>
              <p className="text-gray-600">Manage event organisers and organisations</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Organiser
            </button>
          </div>
        </div>

        <DataTable
          data={organisers}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search organisers..."
          title="Organisers"
        />

        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingOrganiser ? 'Edit Organiser' : 'Create Organiser'}
          formData={formData}
          setFormData={setFormData}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default OrganiserManagement;

