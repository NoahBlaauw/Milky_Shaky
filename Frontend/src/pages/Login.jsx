import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await login(formData);
      navigate('/order');
    } catch (err) {
      setError(err.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* Cup-shaped container */}
      <div style={{
        width: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '50px 50px 50px 50px',
        boxShadow: '0 10px 30px rgba(255, 105, 180, 0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Strawberry Milkshake Fill Effect (Bottom 60%) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%', // Increased from 45% to 60%
          background: 'linear-gradient(180deg, #FFC0CB 0%, #FFB6C1 30%, #FF69B4 70%, #FF1493 100%)',
          zIndex: 0,
          borderRadius: '0 0 50px 50px'
        }}>
          {/* Animated Wave Effect - Matches milkshake color */}
          <svg
            style={{
              position: 'absolute',
              top: '-2px',
              left: 0,
              width: '100%',
              height: '60px'
            }}
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
          >
            {/* Main wave - same color as milkshake top */}
            <path
              d="M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z"
              fill="#FFC0CB" // Matches the top of the gradient
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z;
                  M0,30 Q100,50 200,30 T400,30 L400,60 L0,60 Z;
                  M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z
                "
              />
            </path>
            {/* Secondary wave for depth - slightly darker */}
            <path
              d="M0,35 Q100,15 200,35 T400,35 L400,60 L0,60 Z"
              fill="#FFB6C1" // Slightly darker pink
              opacity="0.7"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M0,35 Q100,15 200,35 T400,35 L400,60 L0,60 Z;
                  M0,35 Q100,55 200,35 T400,35 L400,60 L0,60 Z;
                  M0,35 Q100,15 200,35 T400,35 L400,60 L0,60 Z
                "
              />
            </path>
            {/* Foam/cream effect on top */}
            <path
              d="M0,25 Q100,5 200,25 T400,25 L400,60 L0,60 Z"
              fill="#FFFFFF"
              opacity="0.3"
            >
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M0,25 Q100,5 200,25 T400,25 L400,60 L0,60 Z;
                  M0,25 Q100,45 200,25 T400,25 L400,60 L0,60 Z;
                  M0,25 Q100,5 200,25 T400,25 L400,60 L0,60 Z
                "
              />
            </path>
          </svg>

          {/* Bubbles */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '10px',
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            animation: 'float 4s infinite ease-in-out'
          }} />
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '70%',
            width: '8px',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            animation: 'float 5s infinite ease-in-out 1s'
          }} />
          <div style={{
            position: 'absolute',
            top: '55%',
            left: '45%',
            width: '12px',
            height: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: '50%',
            animation: 'float 6s infinite ease-in-out 2s'
          }} />
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '85%',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            borderRadius: '50%',
            animation: 'float 7s infinite ease-in-out 3s'
          }} />
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '30%',
            width: '7px',
            height: '7px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            animation: 'float 5.5s infinite ease-in-out 1.5s'
          }} />
        </div>

        {/* Cup Top (Pink Header) */}
        <div style={{
          backgroundColor: '#FF69B4',
          padding: '40px 40px 30px 40px',
          textAlign: 'center',
          borderRadius: '0 0 20px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '32px',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Login
          </h1>
          <p style={{
            color: '#FFFFFF',
            fontSize: '14px',
            opacity: 0.9
          }}>
            Welcome back to Milky Shaky
          </p>
        </div>

        {/* Cup Body (White Form Area with transparent background) */}
        <div style={{ 
          padding: '40px',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent' // Fully transparent to show milkshake
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '14px',
                textShadow: '0 0 3px rgba(255,255,255,0.8)' // Makes text readable on pink
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your-email@example.com"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #FFE5EC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)' // Almost fully opaque white
                }}
                onFocus={(e) => e.target.style.border = '2px solid #FF69B4'}
                onBlur={(e) => e.target.style.border = '2px solid #FFE5EC'}
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '14px',
                textShadow: '0 0 3px rgba(255,255,255,0.8)' // Makes text readable on pink
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #FFE5EC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)' // Almost fully opaque white
                }}
                onFocus={(e) => e.target.style.border = '2px solid #FF69B4'}
                onBlur={(e) => e.target.style.border = '2px solid #FFE5EC'}
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(255, 235, 238, 0.98)',
                border: '2px solid #D32F2F',
                borderRadius: '8px',
                marginBottom: '20px',
                color: '#D32F2F',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#E0E0E0' : '#FF69B4',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(255, 105, 180, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#E91E63';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#FF69B4';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link to Signup */}
          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ 
              color: '#2D2D2D', 
              fontSize: '14px',
              textShadow: '0 0 3px rgba(255,255,255,0.8)' // Makes text readable on pink
            }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#C71585',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Test Credentials */}
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            border: '2px solid #FFB6D9',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#2D2D2D'
          }}>
            <strong>Test Credentials:</strong>
            <div style={{ marginTop: '10px', lineHeight: '1.8' }}>
              <div>Patron: <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FFE5EC' }}>sarah@example.com</code> / <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FFE5EC' }}>password123</code></div>
              <div>Manager: <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FFE5EC' }}>manager@milkyshaky.com</code> / <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FFE5EC' }}>password123</code></div>
            </div>
          </div>
        </div>

        {/* Add CSS animation for bubbles */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); opacity: 0.5; }
              50% { transform: translateY(-25px); opacity: 0.9; }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Login;