import './index.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Vault from './components/Vault';

// Private Route wrapper for protected pages
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "5rem" }}><h2>Loading Secure Vault...</h2></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/vault" element={
        <PrivateRoute>
          <Vault />
        </PrivateRoute>
      } />
      {/* Redirect any unknown paths to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
