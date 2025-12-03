import { useAuth } from '../context/AuthContext';

function LookupManagement() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <h1>⚙️ Lookup Management</h1>
      <p>Lookup management placeholder - we'll build this in Step 10!</p>
      <p>Logged in as: {user.firstname} ({user.role})</p>
    </div>
  );
}

export default LookupManagement;