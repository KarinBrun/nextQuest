import { NavLink, Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import './Header.scss';

function Header() {
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
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>

        <Link
          to="/login"
          className="mobile-account"
          aria-label="Account"
        >
          <UserRound size={24} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
