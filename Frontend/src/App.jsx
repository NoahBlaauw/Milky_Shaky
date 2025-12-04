import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
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
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <div style={{ minHeight: 'calc(100vh - 80px)' }}>
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
      </div>
    </Router>
  );
}

export default App;