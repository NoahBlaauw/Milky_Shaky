import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, isManager, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to check if current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      padding: '15px 30px',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      {/* Left side: Logo/Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          🥤 Milky Shaky
        </Link>

        {/* Navigation Links - Only show if authenticated */}
        {isAuthenticated() && (
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Order Link - Available to all authenticated users */}
            <Link
              to="/order"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                backgroundColor: isActive('/order') ? '#555' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              📝 Order
            </Link>

            {/* My Orders Link - Available to all authenticated users */}
            <Link
              to="/my-orders"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                backgroundColor: isActive('/my-orders') ? '#555' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              📋 My Orders
            </Link>

            {/* Manager-Only Links */}
            {isManager() && (
              <>
                <Link
                  to="/lookups"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    backgroundColor: isActive('/lookups') ? '#555' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  ⚙️ Lookups
                </Link>

                <Link
                  to="/reports"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 15px',
                    borderRadius: '4px',
                    backgroundColor: isActive('/reports') ? '#555' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  📊 Reports
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side: User info and auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAuthenticated() ? (
          <>
            {/* User info */}
            <div style={{
              padding: '8px 15px',
              backgroundColor: '#444',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              👋 {user.firstname}
              {isManager() && (
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  MANAGER
                </span>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            {/* Login button */}
            <Link to="/login">
              <button
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                🔐 Login
              </button>
            </Link>

            {/* Signup button */}
            <Link to="/signup">
              <button
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                📝 Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;