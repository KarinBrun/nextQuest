import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until Supabase finishes checking the session.
  if (loading) {
    return <p role="status">Checking authentication...</p>;
  }

  // Redirect signed-out users to login.
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
        replace
      />
    );
  }

  // Render the protected page when authenticated.
  return <Outlet />;
}

export default ProtectedRoute;
