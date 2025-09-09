import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function MajestyRoute({ children }) {
  // Check if user is logged in as Majesty
  const majestyToken = localStorage.getItem('majesty_token');
  const majesty = localStorage.getItem('majesty');

  if (!majestyToken || !majesty) {
    return <Navigate to="/majesty-login" replace />;
  }

  try {
    const majestyData = JSON.parse(majesty);
    if (!majestyData.is_active) {
      localStorage.removeItem('majesty_token');
      localStorage.removeItem('majesty');
      return <Navigate to="/majesty-login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('majesty_token');
    localStorage.removeItem('majesty');
    return <Navigate to="/majesty-login" replace />;
  }

  return children;
}
