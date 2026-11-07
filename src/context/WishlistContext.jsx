import { useState } from 'react';
import { WishlistContext } from './wishlistStore';

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const addGame = (game) => {
    setWishlist((current) => {
      if (current.some((item) => item.id === game.id)) {
        return current;
      }

      return [...current, game];
    });
  };

  const removeGame = (gameId) => {
    setWishlist((current) =>
      current.filter((game) => game.id !== gameId)
    );
  };

  const isInWishlist = (gameId) => {
    return wishlist.some((game) => game.id === gameId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addGame,
        removeGame,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
