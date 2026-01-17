// admin-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './components/auth/LoginScreen';
import ResetPasswordScreen from './components/auth/ResetPasswordScreen';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import './styles/App.css';
import './styles/Layout.css';
import './styles/Dashboard.css';
import './styles/Components.css';

// Private Route Component
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
}

// Public Route Component
function PublicRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/reset-password/:token" 
        element={<ResetPasswordScreen />}
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;