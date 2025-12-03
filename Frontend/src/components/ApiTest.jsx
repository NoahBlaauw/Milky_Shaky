import { useState } from 'react';
import authService from '../services/authService';
import lookupService from '../services/lookupService';

function ApiTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: 'sarah@example.com',
        password: 'password123'
      });
      setResult(`✅ Login successful! Token: ${response.token.substring(0, 20)}...`);
    } catch (error) {
      setResult(`❌ Login failed: ${error.error || error.message}`);
    }
    setLoading(false);
  };

  const testGetLookups = async () => {
    setLoading(true);
    try {
      const response = await lookupService.getAllLookups();
      setResult(`✅ Lookups fetched! Flavours: ${response.flavours.length}, Toppings: ${response.toppings.length}, Consistencies: ${response.consistencies.length}`);
    } catch (error) {
      setResult(`❌ Failed to fetch lookups: ${error.error || error.message}`);
    }
    setLoading(false);
  };

  const testLogout = () => {
    authService.logout();
    setResult('✅ Logged out successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 API Service Tests</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={testLogin} disabled={loading}>
          Test Login
        </button>
        <button onClick={testGetLookups} disabled={loading}>
          Test Get Lookups
        </button>
        <button onClick={testLogout} disabled={loading}>
          Test Logout
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (result.includes('✅') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '5px',
          marginTop: '10px'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default ApiTest;