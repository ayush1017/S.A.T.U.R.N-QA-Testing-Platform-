import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthRedirectPath } from '../utils/authStorage';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-900">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = getAuthRedirectPath();
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}
