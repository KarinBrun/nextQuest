import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Layout from './components/layout/Layout';

const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const GameDetailsPage = lazy(() => import('./pages/GameDetailsPage'));
const WantToPlayPage = lazy(() => import('./pages/WantToPlayPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Suspense fallback={<p role="status">Loading page...</p>}>
        <Routes location={backgroundLocation || location}>
          <Route element={<Layout />}>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/games/:id" element={<GameDetailsPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<WantToPlayPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />       
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route
              path="/games/:id"
              element={<GameDetailsPage isModal />}
            />
          </Routes>
        )}
      </Suspense>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
