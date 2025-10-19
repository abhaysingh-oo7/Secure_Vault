import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Vault from './components/Vault';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Secure Vault...</p>
        </div>
      </div>
    );
  }

  return user ? <Vault /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
