import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Search from './views/search';
import Home from './views/home';
import Login from './views/login';
import { AuthProvider } from './services/auth/authcontext';
import ReadBooks from './views/read';
import ProtectedRoute from './services/auth/protected';

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
          <Route
            path="/reads"
            element={
              <ProtectedRoute>
                <ReadBooks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;