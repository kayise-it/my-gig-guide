import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function MajestyRoute({ children }) {
  // Check if user is logged in as Management (supports legacy "majesty_*" keys)
  const managementToken = localStorage.getItem('management_token') || localStorage.getItem('majesty_token');
  const management = localStorage.getItem('management') || localStorage.getItem('majesty');

  if (!managementToken || !management) {
    return <Navigate to="/management-login" replace />;
  }

  try {
    const managementData = JSON.parse(management);
    if (!managementData.is_active) {
      localStorage.removeItem('management_token');
      localStorage.removeItem('management');
      // Clean up legacy keys as well
      localStorage.removeItem('majesty_token');
      localStorage.removeItem('majesty');
      return <Navigate to="/management-login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('management_token');
    localStorage.removeItem('management');
    localStorage.removeItem('majesty_token');
    localStorage.removeItem('majesty');
    return <Navigate to="/management-login" replace />;
  }

  return children;
}
