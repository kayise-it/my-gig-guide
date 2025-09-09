import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import CRUDModal from '../../components/admin/CRUDModal';
import useAdminData from '../../hooks/useAdminData';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const ArtistManagement = () => {
  const { showSuccess, showError } = useToast();
  const { fetchEntityData } = useAdminData();
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    stage_name: '',
    contact_email: '',
    real_name: '',
    genre: '',
    bio: '',
    phone_number: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchArtists = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/artists`, {
        headers: getAuthHeaders(),
        params: { page, limit: 10, search }
      });

      if (response.data.success) {
        setArtists(response.data.artists);
        setPagination(response.data.pagination);
      } else {
        showError('Failed to fetch artists');
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      showError('Failed to fetch artists');
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
    fetchArtists(currentPage, searchTerm);
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
    setEditingArtist(null);
    setFormData({
      userId: '',
      stage_name: '',
      contact_email: '',
      real_name: '',
      genre: '',
      bio: '',
      phone_number: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    setFormData({
      userId: artist.userId,
      stage_name: artist.stage_name,
      contact_email: artist.contact_email || '',
      real_name: artist.real_name,
      genre: artist.genre,
      bio: artist.bio,
      phone_number: artist.phone_number
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (artist) => {
    if (!window.confirm(`Are you sure you want to delete artist "${artist.stage_name}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/artists/${artist.id}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        showSuccess('Artist deleted successfully');
        fetchArtists(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to delete artist');
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      showError('Failed to delete artist');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = editingArtist
        ? await axios.put(`${API_BASE_URL}/api/admin/artists/${editingArtist.id}`, formData, {
            headers: getAuthHeaders()
          })
        : await axios.post(`${API_BASE_URL}/api/admin/artists`, formData, {
            headers: getAuthHeaders()
          });

      if (response.data.success) {
        showSuccess(editingArtist ? 'Artist updated successfully' : 'Artist created successfully');
        setIsModalOpen(false);
        fetchArtists(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to save artist');
      }
    } catch (error) {
      console.error('Error saving artist:', error);
      showError('Failed to save artist');
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true
    },
    {
      key: 'stage_name',
      title: 'Stage Name',
      sortable: true
    },
    {
      key: 'real_name',
      title: 'Real Name',
      sortable: true
    },
    {
      key: 'genre',
      title: 'Genre',
      sortable: true
    },
    {
      key: 'user',
      title: 'User',
      sortable: false,
      render: (user) => user ? `${user.username} (${user.email})` : 'N/A'
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
      label: 'User (optional; leave blank to auto-create by Contact Email)',
      type: 'select',
      required: false,
      options: [{ value: '', label: 'Auto-create from Contact Email' }, ...users.map(user => ({ value: user.id, label: `${user.username} (${user.email})` }))]
    },
    {
      name: 'stage_name',
      label: 'Stage Name',
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
      name: 'real_name',
      label: 'Real Name',
      type: 'text',
      required: true
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'text',
      required: true
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      required: false
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'text',
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Artist Management</h1>
              <p className="text-gray-600">Manage artist profiles and information</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Artist
            </button>
          </div>
        </div>

        <DataTable
          data={artists}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search artists..."
          title="Artists"
        />

        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingArtist ? 'Edit Artist' : 'Create Artist'}
          formData={formData}
          setFormData={setFormData}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default ArtistManagement;

