// File: frontend/src/hooks/useAdminData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const useAdminData = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('management_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityData = async (entity, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/${entity}`, {
        headers: getAuthHeaders(),
        params
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch ${entity}`);
      }
    } catch (err) {
      console.error(`Error fetching ${entity}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetchStats: fetchStats,
    fetchEntityData
  };
};

export default useAdminData;


