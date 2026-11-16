import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

const {
  mockSignUp,
  mockSignInWithPassword,
  mockSignOut,
  mockOnAuthStateChange,
  mockUnsubscribe,
} = vi.hoisted(() => ({
  mockSignUp: vi.fn(),
  mockSignInWithPassword: vi.fn(),
  mockSignOut: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockUnsubscribe: vi.fn(),
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

function TestAuth() {
  const { user, loading, register, login, logout } = useAuth();
  const [message, setMessage] = useState('');

  async function handleAction(action) {
    try {
      await action('test@example.com', 'password123');
      setMessage('Success');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <p>{loading ? 'Loading' : 'Ready'}</p>
      <p>{user ? user.email : 'Not logged in'}</p>
      <p role="status">{message}</p>

      <button onClick={() => handleAction(register)}>
        Register
      </button>
      <button onClick={() => handleAction(login)}>
        Login
      </button>
      <button onClick={() => handleAction(logout)}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  let authCallback;

  beforeEach(() => {
    vi.clearAllMocks();

    mockOnAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;

      callback('INITIAL_SESSION', null);

      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      };
    });

    mockSignUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    mockSignOut.mockResolvedValue({ error: null });
  });

  it('starts with no authenticated user', async () => {
    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    expect(
      await screen.findByText('Not logged in')
    ).toBeInTheDocument();

    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('registers a user successfully', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', {
      name: 'Register',
    }));

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(
      await screen.findByRole('status')
    ).toHaveTextContent('Success');
  });

  it('logs in successfully', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', {
      name: 'Login',
    }));

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(
      await screen.findByRole('status')
    ).toHaveTextContent('Success');
  });

  it('handles login errors', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: new Error('Invalid login credentials'),
    });

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', {
      name: 'Login',
    }));

    expect(
      await screen.findByRole('status')
    ).toHaveTextContent('Invalid login credentials');
  });

  it('updates authentication state when a user logs in', async () => {
    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    authCallback('SIGNED_IN', {
      user: {
        id: '123',
        email: 'test@example.com',
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText('test@example.com')
      ).toBeInTheDocument();
    });
  });

  it('clears authentication state after logout', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    authCallback('SIGNED_IN', {
      user: {
        id: '123',
        email: 'test@example.com',
      },
    });

    await screen.findByText('test@example.com');

    await user.click(screen.getByRole('button', {
      name: 'Logout',
    }));

    expect(mockSignOut).toHaveBeenCalled();

    authCallback('SIGNED_OUT', null);

    await waitFor(() => {
      expect(
        screen.getByText('Not logged in')
      ).toBeInTheDocument();
    });
  });

  it('unsubscribes from auth changes on unmount', () => {
    const { unmount } = render(
      <AuthProvider>
        <TestAuth />
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
