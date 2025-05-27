// src/components/DisplayRoleName.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // your configured axios instance
import API_BASE_URL from '../api/config';

const DisplayRoleName = ({ currentUser, }) => {
  const [displayName, setDisplayName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser?.role) return;

    const fetchDisplayName = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/acl-trusts/${currentUser.role}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDisplayName(response.data.display_name);
      } catch (error) {
        console.error('Failed to fetch role display name:', error);
      }
    };

    fetchDisplayName();
  }, [currentUser]);

  return (
    <div className="text-sm text-gray-700">
      Role: <strong>{displayName || 'Loading...'}</strong>
    </div>
  );
};

export default DisplayRoleName;