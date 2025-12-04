import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC2D4 50%, #FFB3C6 100%)',
      padding: '80px 40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 182, 193, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 8s infinite ease-in-out'
      }} />

      {/* Floating decorative shapes */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2) 0%, rgba(255, 20, 147, 0.1) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        animation: 'float 6s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '45px',
        height: '45px',
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.25) 0%, rgba(255, 105, 180, 0.15) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(135deg)',
        animation: 'float 8s infinite ease-in-out 2s'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '20%',
        width: '35px',
        height: '35px',
        background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.2) 0%, rgba(255, 105, 180, 0.1) 100%)',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(45deg)',
        animation: 'float 7s infinite ease-in-out 1s'
      }} />

      {/* Main Content Container */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '60px 50px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(255, 105, 180, 0.15), 0 0 1px rgba(255, 105, 180, 0.1)',
          border: '1px solid rgba(255, 182, 217, 0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}>
          <h1 style={{
            fontSize: '64px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-1px',
            lineHeight: '1.1'
          }}>
            Milky Shaky
          </h1>
          
          <p style={{
            fontSize: '20px',
            margin: '24px 0 12px 0',
            color: '#4A4A4A',
            lineHeight: '1.7',
            fontWeight: '400',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Order your favorite custom milkshakes online and skip the line
          </p>

          <div style={{
            display: 'inline-flex',
            gap: '24px',
            marginTop: '16px',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, rgba(255, 228, 233, 0.5) 0%, rgba(255, 214, 224, 0.5) 100%)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 182, 217, 0.3)'
          }}>
            <span style={{ 
              color: '#FF1493', 
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '0.5px'
            }}>
              7 Flavors
            </span>
            <span style={{ 
              color: '#FFB6C1',
              fontWeight: '300',
              fontSize: '15px'
            }}>
              •
            </span>
            <span style={{ 
              color: '#FF1493', 
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '0.5px'
            }}>
              6 Toppings
            </span>
            <span style={{ 
              color: '#FFB6C1',
              fontWeight: '300',
              fontSize: '15px'
            }}>
              •
            </span>
            <span style={{ 
              color: '#FF1493', 
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '0.5px'
            }}>
              4 Consistencies
            </span>
          </div>

          {/* CTA Buttons */}
          {isAuthenticated() ? (
            <div style={{ marginTop: '48px' }}>
              <div style={{
                padding: '24px 40px',
                background: 'linear-gradient(135deg, rgba(255, 228, 233, 0.6) 0%, rgba(255, 214, 224, 0.6) 100%)',
                border: '1px solid rgba(255, 182, 217, 0.4)',
                borderRadius: '16px',
                marginBottom: '36px',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{
                  fontSize: '18px',
                  margin: 0,
                  color: '#2D2D2D',
                  fontWeight: '400',
                  letterSpacing: '0.3px'
                }}>
                  Welcome back, <strong style={{ 
                    color: '#FF1493',
                    fontWeight: '700'
                  }}>{user.firstname}</strong>
                </p>
              </div>

              <Link to="/order">
                <button style={{
                  padding: '18px 56px',
                  fontSize: '18px',
                  background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 8px 24px rgba(255, 20, 147, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.5px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(255, 20, 147, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(255, 20, 147, 0.3)';
                }}
                >
                  Order Now
                </button>
              </Link>

              <div style={{ marginTop: '28px' }}>
                <Link to="/my-orders" style={{
                  color: '#FF1493',
                  fontSize: '16px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  borderBottom: '2px solid transparent',
                  transition: 'border-bottom 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #FF1493'}
                onMouseLeave={(e) => e.target.style.borderBottom = '2px solid transparent'}
                >
                  View your order history →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginTop: '48px',
              flexWrap: 'wrap'
            }}>
              <Link to="/login">
                <button style={{
                  padding: '18px 48px',
                  fontSize: '17px',
                  background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(255, 20, 147, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 28px rgba(255, 20, 147, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 20, 147, 0.25)';
                }}
                >
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button style={{
                  padding: '18px 48px',
                  fontSize: '17px',
                  background: 'white',
                  color: '#FF1493',
                  border: '2px solid #FF1493',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(255, 20, 147, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = '#FF1493';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = '0 10px 28px rgba(255, 20, 147, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'white';
                  e.target.style.color = '#FF1493';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 20, 147, 0.1)';
                }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(-45deg); 
            }
            50% { 
              transform: translateY(-25px) rotate(-45deg); 
            }
          }

          @keyframes pulse {
            0%, 100% { 
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;