import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://62.72.18.206:3000';

const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('majesty_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });

      // Attempt JSON parse, fallback to text
      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { message: text };
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Clear token and redirect to Majesty login
          try {
            localStorage.removeItem('majesty_token');
            localStorage.removeItem('majesty');
          } catch (_) {}
          // Avoid breaking SSR
          if (typeof window !== 'undefined') {
            window.location.href = '/majesty-login';
          }
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic CRUD operations
  const getList = useCallback(async (entity, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/admin/${entity}${queryString ? `?${queryString}` : ''}`;
    return makeRequest(url);
  }, [makeRequest]);

  const getItem = useCallback(async (entity, id) => {
    return makeRequest(`/api/admin/${entity}/${id}`);
  }, [makeRequest]);

  const createItem = useCallback(async (entity, data) => {
    return makeRequest(`/api/admin/${entity}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }, [makeRequest]);

  const updateItem = useCallback(async (entity, id, data) => {
    return makeRequest(`/api/admin/${entity}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }, [makeRequest]);

  const deleteItem = useCallback(async (entity, id) => {
    return makeRequest(`/api/admin/${entity}/${id}`, {
      method: 'DELETE'
    });
  }, [makeRequest]);

  // Specific entity operations
  const users = {
    list: (params) => getList('users', params),
    get: (id) => getItem('users', id),
    create: (data) => createItem('users', data),
    update: (id, data) => updateItem('users', id, data),
    delete: (id) => deleteItem('users', id)
  };

  const artists = {
    list: (params) => getList('artists', params),
    get: (id) => getItem('artists', id),
    create: (data) => createItem('artists', data),
    update: (id, data) => updateItem('artists', id, data),
    delete: (id) => deleteItem('artists', id)
  };

  const organisers = {
    list: (params) => getList('organisers', params),
    get: (id) => getItem('organisers', id),
    create: (data) => createItem('organisers', data),
    update: (id, data) => updateItem('organisers', id, data),
    delete: (id) => deleteItem('organisers', id)
  };

  const venues = {
    list: (params) => getList('venues', params),
    get: (id) => getItem('venues', id),
    create: (data) => createItem('venues', data),
    update: (id, data) => updateItem('venues', id, data),
    delete: (id) => deleteItem('venues', id)
  };

  const events = {
    list: (params) => getList('events', params),
    get: (id) => getItem('events', id),
    create: (data) => createItem('events', data),
    update: (id, data) => updateItem('events', id, data),
    delete: (id) => deleteItem('events', id)
  };

  const stats = {
    get: () => makeRequest('/api/admin/stats')
  };

  return {
    loading,
    error,
    users,
    artists,
    organisers,
    venues,
    events,
    stats,
    makeRequest
  };
};

export default useAdminAPI;
