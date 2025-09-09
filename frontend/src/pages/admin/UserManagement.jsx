import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/admin/DataTable';
import CRUDModal from '../../components/admin/CRUDModal';
import useAdminData from '../../hooks/useAdminData';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const UserManagement = () => {
  const { showSuccess, showError } = useToast();
  const { fetchEntityData } = useAdminData();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 6
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders(),
        params: { page, limit: 10, search }
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        showError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 6
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/admin/users/${user.id}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        showSuccess('User deleted successfully');
        fetchUsers(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = { ...formData };
      if (editingUser && !submitData.password) {
        delete submitData.password; // Don't send empty password for updates
      }

      const response = editingUser
        ? await axios.put(`${API_BASE_URL}/api/admin/users/${editingUser.id}`, submitData, {
            headers: getAuthHeaders()
          })
        : await axios.post(`${API_BASE_URL}/api/admin/users`, submitData, {
            headers: getAuthHeaders()
          });

      if (response.data.success) {
        showSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
        setIsModalOpen(false);
        fetchUsers(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showError('Failed to save user');
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      sortable: true
    },
    {
      key: 'username',
      title: 'Username',
      sortable: true
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (role, user) => user.aclInfo?.acl_display || 'User'
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
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: !editingUser,
      placeholder: editingUser ? 'Leave blank to keep current password' : ''
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 6, label: 'User' },
        { value: 3, label: 'Artist' },
        { value: 4, label: 'Organiser' },
        { value: 1, label: 'Admin' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New User
            </button>
          </div>
        </div>

        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search users..."
          title="Users"
        />

        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={editingUser ? 'Edit User' : 'Create User'}
          formData={formData}
          setFormData={setFormData}
          formFields={formFields}
        />
      </div>
    </div>
  );
};

export default UserManagement;

