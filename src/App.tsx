import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';
import Login from './views/login';
import { AuthProvider, useAuth } from './services/auth/authcontext'; // Import useAuth

interface ProtectedRouteProps {
  children: React.ReactNode;
}
function ProtectedRoute({ children }: ProtectedRouteProps) {
  
  const { user, loading } = useAuth();

  if (loading) {
    // Voit lisätä latausindikaattorin tähän
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;