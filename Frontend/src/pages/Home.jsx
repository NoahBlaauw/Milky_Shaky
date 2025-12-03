import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🥤 Welcome to Milky Shaky!</h1>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>
        Order your favorite custom milkshakes online and skip the line!
      </p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        {!isAuthenticated() ? (
          <>
            <Link to="/login">
              <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <Link to="/order">
            <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
              Order Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;