import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        🥤 Welcome to Milky Shaky!
      </h1>
      
      <p style={{ fontSize: '20px', margin: '20px 0', color: '#666', lineHeight: '1.6' }}>
        Order your favorite custom milkshakes online and skip the line!
        <br />
        Choose from 7 flavors, 6 toppings, and 4 consistencies.
      </p>

      {isAuthenticated() ? (
        <div style={{ marginTop: '40px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              👋 Welcome back, <strong>{user.firstname}</strong>!
            </p>
          </div>

          <Link to="/order">
            <button style={{
              padding: '15px 40px',
              fontSize: '20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              🛒 Order Now
            </button>
          </Link>

          <div style={{ marginTop: '30px' }}>
            <Link to="/my-orders" style={{ color: '#007bff', fontSize: '16px' }}>
              View your order history →
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
          <Link to="/login">
            <button style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              🔐 Login
            </button>
          </Link>

          <Link to="/signup">
            <button style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              📝 Sign Up
            </button>
          </Link>
        </div>
      )}

      {/* Feature highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '60px'
      }}>
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚡</div>
          <h3>Skip the Line</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Pre-order online and pick up when ready
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎨</div>
          <h3>Customize</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            7 flavors × 6 toppings × 4 consistencies
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
          <h3>Discounts</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Earn up to 15% off as a frequent customer
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;