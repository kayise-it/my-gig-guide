// src/components/DisplayRoleName.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // your configured axios instance
import API_BASE_URL from '../api/config';

const DisplayRoleName = ({ role, currentUser }) => {
  const [displayName, setDisplayName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const roleToUse = role || currentUser?.role;
    
    // Use static role names to avoid API calls and authentication issues
    const roleNames = { 
      1: 'User', 
      2: 'User', 
      3: 'Artist', 
      4: 'Organiser', 
      5: 'Admin' 
    };
    
    setDisplayName(roleNames[roleToUse] || 'User');
  }, [role, currentUser]);

  return displayName || 'Loading...';
};

export default DisplayRoleName;