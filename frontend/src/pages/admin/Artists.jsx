import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import useAdminAPI from '../../hooks/useAdminAPI';

const Artists = () => {
  const { artists: artistAPI, loading, error } = useAdminAPI();
  const [artists, setArtists] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({
    stage_name: '',
    real_name: '',
    genre: '',
    bio: '',
    website: '',
    social_media: '',
    contact_email: ''
  });

  const columns = [
    {
      header: 'Artist',
      key: 'stage_name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.real_name}</div>
        </div>
      )
    },
    {
      header: 'Genre',
      key: 'genre',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
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
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const fetchArtists = async (page = 1, searchTerm = '') => {
    try {
      const response = await artistAPI.list({
        page,
        limit: 10,
        search: searchTerm
      });
      
      if (response.success) {
        setArtists(response.artists);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Error fetching artists:', err);
    }
  };

  useEffect(() => {
    fetchArtists(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreate = () => {
    setEditingArtist(null);
    setFormData({
      stage_name: '',
      real_name: '',
      genre: '',
      bio: '',
      website: '',
      social_media: '',
      contact_email: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    setFormData({
      stage_name: artist.stage_name,
      real_name: artist.real_name,
      genre: artist.genre,
      bio: artist.bio,
      website: artist.website,
      social_media: artist.social_media,
      contact_email: artist.contact_email || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (artist) => {
    if (window.confirm(`Are you sure you want to delete artist "${artist.stage_name}"?`)) {
      try {
        await artistAPI.delete(artist.id);
        fetchArtists(currentPage, search);
      } catch (err) {
        console.error('Error deleting artist:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      // Remove any legacy user_id to allow backend auto-link/create by contact_email
      delete payload.user_id;
      if (editingArtist) {
        await artistAPI.update(editingArtist.id, payload);
      } else {
        await artistAPI.create(payload);
      }
      setIsModalOpen(false);
      fetchArtists(currentPage, search);
    } catch (err) {
      console.error('Error saving artist:', err);
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
            <h2 className="text-2xl font-bold text-gray-900">Artist Management</h2>
            <p className="text-gray-600">Manage artist profiles and information</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add New Artist
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
          data={artists}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search artists..."
          entityName="artists"
        />

        {/* Create/Edit Modal */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingArtist ? 'Edit Artist' : 'Create New Artist'}
          onSubmit={handleSubmit}
          loading={loading}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stage Name</label>
              <input
                type="text"
                name="stage_name"
                value={formData.stage_name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Real Name</label>
              <input
                type="text"
                name="real_name"
                value={formData.real_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
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
              <label className="block text-sm font-medium text-gray-700">Social Media</label>
              <input
                type="text"
                name="social_media"
                value={formData.social_media}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
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

export default Artists;
