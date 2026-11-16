import { render, screen } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminRoute from './AdminRoute';
import { useAuth } from '../../context/useAuth';

const { mockFrom, mockSelect, mockEq, mockMaybeSingle } =
  vi.hoisted(() => ({
    mockFrom: vi.fn(),
    mockSelect: vi.fn(),
    mockEq: vi.fn(),
    mockMaybeSingle: vi.fn(),
  }));

vi.mock('../../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/"
          element={<h1>Discover Page</h1>}
        />
        <Route
          path="/login"
          element={<h1>Login Page</h1>}
        />
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<h1>Admin Dashboard</h1>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      user: {
        id: 'admin-123',
        email: 'admin@example.com',
      },
      loading: false,
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
    });

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });

    mockMaybeSingle.mockResolvedValue({
      data: { user_id: 'admin-123' },
      error: null,
    });
  });

  it('redirects unauthenticated users to login', async () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderAdminRoute();

    expect(
      await screen.findByRole('heading', {
        name: 'Login Page',
      })
    ).toBeInTheDocument();

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('shows a loading message while authentication is loading', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderAdminRoute();

    expect(
      screen.getByText('Checking administrator access...')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Admin Dashboard')
    ).not.toBeInTheDocument();
  });

  it('allows administrators to access the dashboard', async () => {
    renderAdminRoute();

    expect(
      await screen.findByRole('heading', {
        name: 'Admin Dashboard',
      })
    ).toBeInTheDocument();

    expect(mockFrom).toHaveBeenCalledWith('admin_users');
    expect(mockSelect).toHaveBeenCalledWith('user_id');
    expect(mockEq).toHaveBeenCalledWith(
      'user_id',
      'admin-123'
    );
  });

  it('redirects regular users to Discover', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });

    renderAdminRoute();

    expect(
      await screen.findByRole('heading', {
        name: 'Discover Page',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Admin Dashboard')
    ).not.toBeInTheDocument();
  });

  it('denies access when the database returns an error', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: new Error('Database unavailable'),
    });

    renderAdminRoute();

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Unable to verify administrator access.'
    );

    expect(
      screen.queryByText('Admin Dashboard')
    ).not.toBeInTheDocument();
  });

  it('does not display admin content while permissions are being checked', () => {
    mockMaybeSingle.mockReturnValue(
      new Promise(() => {})
    );

    renderAdminRoute();

    expect(
      screen.getByText('Checking administrator access...')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Admin Dashboard')
    ).not.toBeInTheDocument();
  });
});
