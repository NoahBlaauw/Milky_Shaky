import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthTest() {
  const { user, login, signup, logout, isAuthenticated, isManager } = useAuth();
  
  const [email, setEmail] = useState('sarah@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await login({ email, password });
      setMessage('✅ Login successful!');
    } catch (error) {
      setMessage(`❌ Login failed: ${error.error || error.message}`);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage('');
    try {
      await signup({
        firstname: 'Test User',
        email: 'testuser@example.com',
        mobile: '0821112222',
        password: 'test123'
      });
      setMessage('✅ Signup successful!');
    } catch (error) {
      setMessage(`❌ Signup failed: ${error.error || error.message}`);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setMessage('✅ Logged out successfully!');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🔐 Auth Context Test</h2>

      {/* Current User Status */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: isAuthenticated() ? '#d4edda' : '#f8d7da',
        border: '1px solid ' + (isAuthenticated() ? '#c3e6cb' : '#f5c6cb'),
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h3>Current Status:</h3>
        {isAuthenticated() ? (
          <>
            <p>✅ <strong>Logged In</strong></p>
            <p>Name: {user.firstname}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Is Manager: {isManager() ? 'Yes' : 'No'}</p>
          </>
        ) : (
          <p>❌ <strong>Not Logged In</strong></p>
        )}
      </div>

      {/* Login Form */}
      {!isAuthenticated() && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Login Test</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleLogin} 
              disabled={loading}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Try: sarah@example.com / password123<br />
            Or: manager@milkyshaky.com / password123
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {!isAuthenticated() && (
          <button onClick={handleSignup} disabled={loading}>
            Test Signup (New User)
          </button>
        )}
        {isAuthenticated() && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '15px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (message.includes('✅') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '5px',
          marginTop: '10px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AuthTest;