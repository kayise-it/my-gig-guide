import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import useAdminAPI from '../../hooks/useAdminAPI';
import toast from 'react-hot-toast';

const Organisers = () => {
  const { organisers: organiserAPI, loading, error } = useAdminAPI();
  const [organisers, setOrganisers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganiser, setEditingOrganiser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    surname: '',
    name: '',
    contact_email: '',
    phone_number: '',
    website: '',
    logo: '',
    user_id: ''
  });

  const columns = [
    {
      header: 'Organisation',
      key: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.contact_email}</div>
        </div>
      )
    },
    {
      header: 'Contact',
      key: 'contact_phone',
      render: (value, row) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.contact_email}</div>
        </div>
      )
    },
    {
      header: 'User',
      key: 'user',
      render: (value) => (
        <div>
          <div className="text-sm text-gray-900">{value?.username}</div>
          <div className="text-xs text-gray-500">{value?.email}</div>
        </div>
      )
    },
    {
      header: 'Created',
      key: 'createdDate',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const fetchOrganisers = async (page = 1, searchTerm = '') => {
    try {
      const response = await organiserAPI.list({
        page,
        limit: 10,
        search: searchTerm
      });
      
      if (response.success) {
        setOrganisers(response.organisers);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching organisers:', err);
    }
  };

  useEffect(() => {
    fetchOrganisers(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreate = () => {
    setEditingOrganiser(null);
    setFormData({
      first_name: '',
      surname: '',
      name: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      description: '',
      website: '',
      user_id: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (organiser) => {
    setEditingOrganiser(organiser);
    setFormData({
      first_name: organiser.first_name || '',
      surname: organiser.surname || '',
      name: organiser.name,
      contact_email: organiser.contact_email,
      phone_number: organiser.phone_number,
      website: organiser.website,
      logo: organiser.logo,
      user_id: organiser.user_id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (organiser) => {
    if (window.confirm(`Are you sure you want to delete organiser "${organiser.name}"?`)) {
      try {
        await organiserAPI.delete(organiser.id);
        toast.success('Organiser deleted successfully!');
        fetchOrganisers(currentPage, search);
      } catch (err) {
        console.error('Error deleting organiser:', err);
        toast.error(err.message || 'Failed to delete organiser');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrganiser) {
        await organiserAPI.update(editingOrganiser.id, formData);
        toast.success('Organiser updated successfully!');
      } else {
        await organiserAPI.create(formData);
        toast.success('Organiser created successfully!');
      }
      setIsModalOpen(false);
      fetchOrganisers(currentPage, search);
    } catch (err) {
      console.error('Error saving organiser:', err);
      toast.error(err.message || 'Failed to save organiser');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Organiser Management</h2>
            <p className="text-gray-600">Manage event organisers and their information</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add New Organiser
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
          data={organisers}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search organisers..."
          entityName="organisers"
        />

        {/* Create/Edit Modal */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingOrganiser ? 'Edit Organiser' : 'Create New Organiser'}
          onSubmit={handleSubmit}
          loading={loading}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Surname</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organisation Name</label>
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
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default Organisers;

