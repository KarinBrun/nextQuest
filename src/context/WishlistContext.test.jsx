import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { WishlistProvider } from './WishlistContext';
import { useWishlist } from './useWishlist';

const mockGame = {
  id: 119133,
  name: 'Elden Ring',
};

function TestWishlist() {
  const {
    wishlist,
    addGame,
    removeGame,
    isInWishlist,
  } = useWishlist();

  return (
    <div>
      <p>Games in list: {wishlist.length}</p>

      <p>
        In wishlist: {isInWishlist(mockGame.id) ? 'Yes' : 'No'}
      </p>

      <button onClick={() => addGame(mockGame)}>
        Add Game
      </button>

      <button onClick={() => removeGame(mockGame.id)}>
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
  it('adds a game to the wishlist', async () => {
    const user = userEvent.setup();
    renderWishlist();

    await user.click(screen.getByRole('button', {
      name: 'Add Game',
    }));

    expect(
      screen.getByText('Games in list: 1')
    ).toBeInTheDocument();

    expect(
      screen.getByText('In wishlist: Yes')
    ).toBeInTheDocument();
  });

  it('removes a game from the wishlist', async () => {
    const user = userEvent.setup();
    renderWishlist();

    await user.click(screen.getByRole('button', {
      name: 'Add Game',
    }));

    await user.click(screen.getByRole('button', {
      name: 'Remove Game',
    }));

    expect(
      screen.getByText('Games in list: 0')
    ).toBeInTheDocument();

    expect(
      screen.getByText('In wishlist: No')
    ).toBeInTheDocument();
  });

  it('prevents duplicate games', async () => {
    const user = userEvent.setup();
    renderWishlist();

    const addButton = screen.getByRole('button', {
      name: 'Add Game',
    });

    await user.click(addButton);
    await user.click(addButton);

    expect(
      screen.getByText('Games in list: 1')
    ).toBeInTheDocument();
  });
});
