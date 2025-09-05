import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  const roleMap = {
    1: 'superuser',
    3: 'artist',
    4: 'organiser'
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Superuser has access to all protected routes
  if (requiredRole && roleMap[role] !== requiredRole && roleMap[role] !== 'superuser') {
    console.log(`Unauthorized - User role: ${roleMap[role]}, Required: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
}