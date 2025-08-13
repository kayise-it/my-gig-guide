import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  const roleMap = {
    1: 'admin',
    3: 'artist',
    4: 'organiser'
  };

  console.log('PrivateRoute: Checking access:', {
    isAuthenticated,
    role,
    roleMap: roleMap[role],
    requiredRole,
    isLoading
  });

  if (isLoading) {
    console.log('PrivateRoute: Loading state, showing loading...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && roleMap[role] !== requiredRole) {
    console.log(`PrivateRoute: Unauthorized - User role: ${roleMap[role]}, Required: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  console.log('PrivateRoute: Access granted, rendering children');
  return children;
}