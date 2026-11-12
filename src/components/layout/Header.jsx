import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import './Header.scss';

function Header() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setError('');
    setLoggingOut(true);

    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      setError('Unable to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Next<span>Quest</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Discover
          </NavLink>

          <NavLink to="/wishlist">
            Want to Play
          </NavLink>
        </nav>

        <div className="header-actions">
          {!loading && (
            user ? (
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging Out...' : 'Logout'}
              </button>
            ) : (
              <>
                <Link to="/login" className="login-link">
                  Login
                </Link>

                <Link to="/register" className="register-link">
                  Register
                </Link>
              </>
            )
          )}
        </div>

        <div className="mobile-auth">
          {!loading && (
            user ? (
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging Out...' : 'Logout'}
              </button>
            ) : (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )
          )}
        </div>
      </div>

      {error && (
        <p className="header-error" role="alert">
          {error}
        </p>
      )}
    </header>
  );
}

export default Header;
