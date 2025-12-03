import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ManagerRoute({ children }) {
  const { isAuthenticated, isManager } = useAuth();

  if (!isAuthenticated()) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!isManager()) {
    // User is authenticated but not a manager, redirect to order page
    return <Navigate to="/order" replace />;
  }

  // User is authenticated and is a manager, show the protected content
  return children;
}

export default ManagerRoute;