import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = () => {
    if (!formData.firstname || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/order');
    } catch (err) {
      setError(err.error || 'Signup failed. Please try again.');
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
        width: '450px',
        backgroundColor: '#FFFFFF',
        borderRadius: '50px 50px 50px 50px',
        boxShadow: '0 10px 30px rgba(139, 69, 19, 0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Chocolate Milkshake Fill Effect (Bottom 65%) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background: 'linear-gradient(180deg, #D2B48C 0%, #BC8F8F 30%, #A0522D 70%, #8B4513 100%)',
          zIndex: 0,
          borderRadius: '0 0 50px 50px'
        }}>
          {/* Animated Wave Effect */}
          <svg
            style={{
              position: 'absolute',
              top: '-2px',
              left: 0,
              width: '100%',
              height: '60px'
            }}
            viewBox="0 0 450 60"
            preserveAspectRatio="none"
          >
            {/* Main wave - chocolate color */}
            <path
              d="M0,30 Q112.5,10 225,30 T450,30 L450,60 L0,60 Z"
              fill="#D2B48C"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0,30 Q112.5,10 225,30 T450,30 L450,60 L0,60 Z;
                  M0,30 Q112.5,50 225,30 T450,30 L450,60 L0,60 Z;
                  M0,30 Q112.5,10 225,30 T450,30 L450,60 L0,60 Z
                "
              />
            </path>
            {/* Secondary wave */}
            <path
              d="M0,35 Q112.5,15 225,35 T450,35 L450,60 L0,60 Z"
              fill="#BC8F8F"
              opacity="0.7"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M0,35 Q112.5,15 225,35 T450,35 L450,60 L0,60 Z;
                  M0,35 Q112.5,55 225,35 T450,35 L450,60 L0,60 Z;
                  M0,35 Q112.5,15 225,35 T450,35 L450,60 L0,60 Z
                "
              />
            </path>
            {/* Cream effect */}
            <path
              d="M0,25 Q112.5,5 225,25 T450,25 L450,60 L0,60 Z"
              fill="#F5F5DC"
              opacity="0.4"
            >
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M0,25 Q112.5,5 225,25 T450,25 L450,60 L0,60 Z;
                  M0,25 Q112.5,45 225,25 T450,25 L450,60 L0,60 Z;
                  M0,25 Q112.5,5 225,25 T450,25 L450,60 L0,60 Z
                "
              />
            </path>
          </svg>

          {/* Bubbles */}
          <div style={{
            position: 'absolute',
            top: '12%',
            left: '18%',
            width: '10px',
            height: '10px',
            backgroundColor: 'rgba(245, 245, 220, 0.6)',
            borderRadius: '50%',
            animation: 'float 4s infinite ease-in-out'
          }} />
          <div style={{
            position: 'absolute',
            top: '28%',
            left: '75%',
            width: '8px',
            height: '8px',
            backgroundColor: 'rgba(245, 245, 220, 0.5)',
            borderRadius: '50%',
            animation: 'float 5s infinite ease-in-out 1s'
          }} />
          <div style={{
            position: 'absolute',
            top: '48%',
            left: '42%',
            width: '12px',
            height: '12px',
            backgroundColor: 'rgba(245, 245, 220, 0.55)',
            borderRadius: '50%',
            animation: 'float 6s infinite ease-in-out 2s'
          }} />
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '88%',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(245, 245, 220, 0.45)',
            borderRadius: '50%',
            animation: 'float 7s infinite ease-in-out 3s'
          }} />
          <div style={{
            position: 'absolute',
            top: '38%',
            left: '28%',
            width: '7px',
            height: '7px',
            backgroundColor: 'rgba(245, 245, 220, 0.5)',
            borderRadius: '50%',
            animation: 'float 5.5s infinite ease-in-out 1.5s'
          }} />
        </div>

        {/* Cup Top (Chocolate Brown Header) */}
        <div style={{
          background: 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)',
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
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Sign Up
          </h1>
          <p style={{
            color: '#FFFFFF',
            fontSize: '14px',
            opacity: 0.95,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            Join the Milky Shaky family!
          </p>
        </div>

        {/* Cup Body (Form Area) */}
        <div style={{ 
          padding: '35px 40px 40px 40px',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent'
        }}>
          <form onSubmit={handleSubmit}>
            {/* First Name Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '13px',
                textShadow: '0 0 3px rgba(255,255,255,0.9)'
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="John"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #A0522D'}
                onBlur={(e) => e.target.style.border = '2px solid #D2B48C'}
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '13px',
                textShadow: '0 0 3px rgba(255,255,255,0.9)'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your-email@example.com"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #A0522D'}
                onBlur={(e) => e.target.style.border = '2px solid #D2B48C'}
                disabled={loading}
              />
            </div>

            {/* Mobile Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '13px',
                textShadow: '0 0 3px rgba(255,255,255,0.9)'
              }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="0821234567"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #A0522D'}
                onBlur={(e) => e.target.style.border = '2px solid #D2B48C'}
                disabled={loading}
              />
              <small style={{ 
                color: '#5D4E37', 
                fontSize: '11px',
                textShadow: '0 0 2px rgba(255,255,255,0.9)'
              }}>
                Enter 10 digits (e.g., 0821234567)
              </small>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '13px',
                textShadow: '0 0 3px rgba(255,255,255,0.9)'
              }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #A0522D'}
                onBlur={(e) => e.target.style.border = '2px solid #D2B48C'}
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#2D2D2D',
                fontSize: '13px',
                textShadow: '0 0 3px rgba(255,255,255,0.9)'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  outline: 'none',
                  transition: 'border 0.3s',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #A0522D'}
                onBlur={(e) => e.target.style.border = '2px solid #D2B48C'}
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
                ❌ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#E0E0E0' : 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(139, 69, 19, 0.4)',
                transition: 'all 0.3s',
                textShadow: loading ? 'none' : '1px 1px 2px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, #8B4513 0%, #654321 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Link to Login */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ 
              color: '#2D2D2D', 
              fontSize: '14px',
              textShadow: '0 0 3px rgba(255,255,255,0.9)'
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#8B4513',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Login here
              </Link>
            </p>
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

export default Signup;