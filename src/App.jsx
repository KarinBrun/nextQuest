import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Layout from './components/layout/Layout';

import DiscoverPage from './pages/DiscoverPage';
import GameDetailsPage from './pages/GameDetailsPage';
import WantToPlayPage from './pages/WantToPlayPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/games/:id" element={<GameDetailsPage />} />
          <Route path="/wishlist" element={<WantToPlayPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
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
