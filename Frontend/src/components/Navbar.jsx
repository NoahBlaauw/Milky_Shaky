import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '4px solid #FF1493',
      padding: '25px 50px', 
      boxShadow: '0 4px 15px rgba(220, 20, 60, 0.15)',
      borderRadius: '20px 20px 20px 20px', 
      margin: '0 20px 20px 20px' 
    }}>
      <div style={{
        maxWidth: '1600px', // Increased from 1400px to make it wider
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      {/* Logo/Brand */}
      <Link 
        to="/" 
        style={{ 
          textDecoration: 'none',
          fontSize: '36px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #FF1493 0%, #DC143C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1.5px',
          marginRight: '80px' // ← ADD THIS LINE to push logo away from nav links
        }}
      >
        Milky Shaky
      </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}> {/* Increased gap from 25px to 30px */}
          {!isAuthenticated() ? (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: isActive('/login') ? '#DC143C' : '#2D2D2D',
                  fontWeight: isActive('/login') ? 'bold' : 'normal',
                  fontSize: '17px', // Slightly larger
                  borderBottom: isActive('/login') ? '3px solid #FF1493' : 'none',
                  paddingBottom: '5px',
                  transition: 'all 0.3s'
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: 'none',
                  padding: '14px 28px', // Increased from 12px 24px
                  background: 'linear-gradient(135deg, #FF1493 0%, #DC143C 100%)',
                  color: '#FFFFFF',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '17px', // Slightly larger
                  boxShadow: '0 4px 15px rgba(255, 20, 147, 0.3)',
                  transition: 'all 0.3s'
                }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User Greeting */}
              <span style={{ 
                color: '#6B6B6B', 
                fontSize: '18px', // Slightly larger
                marginRight: '5px' // Extra spacing
              }}>
                Welcome, <strong style={{ color: '#DC143C' }}>{user.firstname}</strong>
              </span>

              {/* Patron Links */}
              <Link
                to="/order"
                style={{
                  textDecoration: 'none',
                  color: isActive('/order') ? '#DC143C' : '#2D2D2D',
                  fontWeight: isActive('/order') ? 'bold' : 'normal',
                  fontSize: '17px', // Slightly larger
                  borderBottom: isActive('/order') ? '3px solid #FF1493' : 'none',
                  paddingBottom: '5px',
                  transition: 'all 0.3s'
                }}
              >
                Order
              </Link>
              <Link
                to="/my-orders"
                style={{
                  textDecoration: 'none',
                  color: isActive('/my-orders') ? '#DC143C' : '#2D2D2D',
                  fontWeight: isActive('/my-orders') ? 'bold' : 'normal',
                  fontSize: '17px', // Slightly larger
                  borderBottom: isActive('/my-orders') ? '3px solid #FF1493' : 'none',
                  paddingBottom: '5px',
                  transition: 'all 0.3s'
                }}
              >
                My Orders
              </Link>

              {/* Manager-Only Links */}
              {user.role === 'manager' && (
                <>
                  <Link
                    to="/lookups"
                    style={{
                      textDecoration: 'none',
                      color: isActive('/lookups') ? '#DC143C' : '#2D2D2D',
                      fontWeight: isActive('/lookups') ? 'bold' : 'normal',
                      fontSize: '17px', // Slightly larger
                      borderBottom: isActive('/lookups') ? '3px solid #FF1493' : 'none',
                      paddingBottom: '5px',
                      transition: 'all 0.3s'
                    }}
                  >
                    Lookups
                  </Link>
                  <Link
                    to="/reports"
                    style={{
                      textDecoration: 'none',
                      color: isActive('/reports') ? '#DC143C' : '#2D2D2D',
                      fontWeight: isActive('/reports') ? 'bold' : 'normal',
                      fontSize: '17px', // Slightly larger
                      borderBottom: isActive('/reports') ? '3px solid #FF1493' : 'none',
                      paddingBottom: '5px',
                      transition: 'all 0.3s'
                    }}
                  >
                    Reports
                  </Link>
                </>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 24px', // Increased from 10px 20px
                  backgroundColor: '#FFFFFF',
                  color: '#DC143C',
                  border: '2px solid #FF1493',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '17px', // Slightly larger
                  transition: 'all 0.3s',
                  marginLeft: '5px' // Extra spacing before logout
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #FF1493 0%, #DC143C 100%)';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#FFFFFF';
                  e.target.style.color = '#DC143C';
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;