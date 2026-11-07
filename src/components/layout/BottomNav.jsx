import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Bookmark } from 'lucide-react';
import './BottomNav.scss';

function BottomNav() {
  const { pathname } = useLocation();

  // Hide bottom navigation on authentication pages.
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/" end>
        <Compass size={23} />
        <span>Discover</span>
      </NavLink>

      <NavLink to="/wishlist">
        <Bookmark size={23} />
        <span>Want to Play</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
