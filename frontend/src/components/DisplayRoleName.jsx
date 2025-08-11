// src/components/DisplayRoleName.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // your configured axios instance
import API_BASE_URL from '../api/config';

const DisplayRoleName = ({ role, currentUser }) => {
  const [displayName, setDisplayName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleToUse = role || currentUser?.role;
    
    // Early fallback if no token or role
    if (!token || !roleToUse) {
      const roleNames = { 3: 'Artist', 4: 'Organiser', 5: 'Admin' };
      setDisplayName(roleNames[roleToUse] || 'User');
      return;
    }

    const fetchDisplayName = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/acl-trusts/${roleToUse}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDisplayName(response.data.display_name);
      } catch (error) {
        console.error('Failed to fetch role display name:', error);
        // Fallback to default role names
        const roleNames = { 3: 'Artist', 4: 'Organiser', 5: 'Admin' };
        setDisplayName(roleNames[roleToUse] || 'User');
      }
    };

    fetchDisplayName();
  }, [role, currentUser]);

  return displayName || 'Loading...';
};

export default DisplayRoleName;