import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { supabase } from '../../services/supabase';

function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (authLoading) return;

      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      setChecking(true);
      setError('');

      const { data, error: queryError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError('Unable to verify administrator access.');
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }

      setChecking(false);
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || checking) {
    return <p>Checking administrator access...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
