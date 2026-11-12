import { useEffect, useState } from 'react';
import { WishlistContext } from './wishlistStore';
import { useAuth } from './useAuth';
import { supabase } from '../services/supabase';

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadWishlist() {
      if (authLoading) return;

      if (!user) {
        setWishlist([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('wishlist_games')
        .select('game_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError('Unable to load your Want to Play list.');
        setWishlist([]);
      } else {
        setWishlist(data.map((item) => item.game_data));
      }

      setLoading(false);
    }

    loadWishlist();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const addGame = async (game) => {
    if (!user) return;

    if (wishlist.some((item) => item.id === game.id)) {
      return;
    }

    setError('');

    const { error: insertError } = await supabase
      .from('wishlist_games')
      .insert({
        user_id: user.id,
        game_id: game.id,
        game_data: game,
      });

    if (insertError) {
      setError('Unable to save this game. Please try again.');
      return;
    }

    setWishlist((current) => {
      if (current.some((item) => item.id === game.id)) {
        return current;
      }

      return [game, ...current];
    });
  };

  const removeGame = async (gameId) => {
    if (!user) return;

    setError('');

    const { error: deleteError } = await supabase
      .from('wishlist_games')
      .delete()
      .eq('user_id', user.id)
      .eq('game_id', gameId);

    if (deleteError) {
      setError('Unable to remove this game. Please try again.');
      return;
    }

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
        loading,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
