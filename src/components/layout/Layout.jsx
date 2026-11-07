import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import './Layout.scss';

function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      <Header />

      <main className={isAuthPage ? 'main-content' : 'main-content with-bottom-nav'}>
        <Outlet />
      </main>

      <BottomNav />
    </>
  );
}

export default Layout;
