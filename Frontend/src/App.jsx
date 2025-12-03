import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ManagerRoute from './components/ManagerRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderForm from './pages/OrderForm';
import MyOrders from './pages/MyOrders';
import LookupManagement from './pages/LookupManagement';
import Reports from './pages/Reports';

import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        {/* Simple navigation bar - we'll make it better in Step 6 */}
        <nav style={{ 
          padding: '15px', 
          backgroundColor: '#333', 
          color: 'white',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>🥤 Milky Shaky</span>
            {isAuthenticated() && (
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="/order" style={{ color: 'white' }}>Order</a>
                <a href="/my-orders" style={{ color: 'white' }}>My Orders</a>
              </div>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (require authentication) */}
          <Route 
            path="/order" 
            element={
              <ProtectedRoute>
                <OrderForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />

          {/* Manager-Only Routes */}
          <Route 
            path="/lookups" 
            element={
              <ManagerRoute>
                <LookupManagement />
              </ManagerRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ManagerRoute>
                <Reports />
              </ManagerRoute>
            } 
          />

          {/* Catch-all: redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;