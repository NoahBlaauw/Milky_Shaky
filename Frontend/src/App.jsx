import { useState } from 'react';
import './App.css';
import ApiTest from './components/ApiTest';

function App() {
  const [message, setMessage] = useState('');

  // Test connection to backend
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setMessage(`✅ Backend connected! Status: ${data.status}`);
    } catch (error) {
      setMessage('❌ Cannot connect to backend. Make sure it is running on http://localhost:5000');
    }
  };

  return (
    <div className="App">
      <h1>🥤 Milky Shaky - Frontend</h1>
      <p>Frontend is running!</p>
      
      <button onClick={testConnection}>
        Test Backend Connection
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (message.includes('✅') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      <ApiTest />
    </div>
  );
}

export default App;