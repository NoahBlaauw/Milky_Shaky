import { useAuth } from '../context/AuthContext';

function Reports() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <h1>📊 Reports</h1>
      <p>Reports placeholder - we'll build this in Step 11!</p>
      <p>Logged in as: {user.firstname} ({user.role})</p>
    </div>
  );
}

export default Reports;