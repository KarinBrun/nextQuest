import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WishlistProvider } from './WishlistContext';
import { useWishlist } from './useWishlist';

const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
};

const mockGame = {
  id: 119133,
  name: 'Elden Ring',
};

const { mockFrom, mockSelect, mockInsert, mockDelete } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockSelect: vi.fn(),
  mockInsert: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('./useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

function TestWishlist() {
  const {
    wishlist,
    addGame,
    removeGame,
    isInWishlist,
    loading,
  } = useWishlist();

  return (
    <div>
      <p>Games in list: {wishlist.length}</p>

      <p>
        In wishlist: {isInWishlist(mockGame.id) ? 'Yes' : 'No'}
      </p>

      <button
        onClick={() => addGame(mockGame)}
        disabled={loading}
      >
        Add Game
      </button>

      <button
        onClick={() => removeGame(mockGame.id)}
        disabled={loading}
      >
        Remove Game
      </button>
    </div>
  );
}

function renderWishlist() {
  return render(
    <WishlistProvider>
      <TestWishlist />
    </WishlistProvider>
  );
}

describe('WishlistContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelect.mockReturnValue({
      eq: () => ({
        order: () => Promise.resolve({
          data: [],
          error: null,
        }),
      }),
    });

    mockInsert.mockResolvedValue({
      error: null,
    });

    mockDelete.mockReturnValue({
      eq: () => ({
        eq: () => Promise.resolve({
          error: null,
        }),
      }),
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    });
  });

  it('adds a game to the wishlist', async () => {
    const user = userEvent.setup();
    renderWishlist();

    await user.click(
      await screen.findByRole('button', {
        name: 'Add Game',
        disabled: false,
      })
    );

    expect(
      await screen.findByText('Games in list: 1')
    ).toBeInTheDocument();

    expect(
      screen.getByText('In wishlist: Yes')
    ).toBeInTheDocument();

    expect(mockInsert).toHaveBeenCalledWith({
      user_id: mockUser.id,
      game_id: mockGame.id,
      game_data: mockGame,
    });
  });

  it('removes a game from the wishlist', async () => {
    const user = userEvent.setup();
    renderWishlist();

    const addButton = await screen.findByRole('button', {
      name: 'Add Game',
      disabled: false,
    });

    await user.click(addButton);

    await screen.findByText('Games in list: 1');

    await user.click(
      screen.getByRole('button', {
        name: 'Remove Game',
      })
    );

    expect(
      await screen.findByText('Games in list: 0')
    ).toBeInTheDocument();

    expect(
      screen.getByText('In wishlist: No')
    ).toBeInTheDocument();
  });

  it('prevents duplicate games', async () => {
    const user = userEvent.setup();
    renderWishlist();

    const addButton = await screen.findByRole('button', {
      name: 'Add Game',
      disabled: false,
    });

    await user.click(addButton);

    await screen.findByText('Games in list: 1');

    await user.click(addButton);

    expect(
      screen.getByText('Games in list: 1')
    ).toBeInTheDocument();

    expect(mockInsert).toHaveBeenCalledTimes(1);
  });
});
