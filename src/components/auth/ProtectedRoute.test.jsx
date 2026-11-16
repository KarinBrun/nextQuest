import { render, screen } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../context/useAuth';

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

function LoginPage() {
  const location = useLocation();

  return (
    <div>
      <h1>Login Page</h1>
      <p data-testid="redirect-from">
        {location.state?.from ?? 'No redirect'}
      </p>
    </div>
  );
}

function renderProtectedRoute(initialEntry = '/wishlist') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/wishlist"
            element={<h1>Want to Play Page</h1>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading message while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderProtectedRoute();

    expect(
      screen.getByRole('status')
    ).toHaveTextContent('Checking authentication...');

    expect(
      screen.queryByText('Want to Play Page')
    ).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', async () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderProtectedRoute();

    expect(
      await screen.findByRole('heading', {
        name: 'Login Page',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('redirect-from')
    ).toHaveTextContent('/wishlist');
  });

  it('allows authenticated users to access the protected page', () => {
    useAuth.mockReturnValue({
      user: {
        id: '123',
        email: 'test@example.com',
      },
      loading: false,
    });

    renderProtectedRoute();

    expect(
      screen.getByRole('heading', {
        name: 'Want to Play Page',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Login Page')
    ).not.toBeInTheDocument();
  });

  it('preserves query parameters and URL fragments when redirecting', async () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderProtectedRoute('/wishlist?sort=newest#saved');

    expect(
      await screen.findByTestId('redirect-from')
    ).toHaveTextContent('/wishlist?sort=newest#saved');
  });
});
