import GameCard from '../components/games/GameCard';
import { useWishlist } from '../context/useWishlist';
import './WantToPlayPage.scss';

function WantToPlayPage() {
  const { wishlist, removeGame, loading, error } = useWishlist();

  return (
    <div className="want-to-play-page">
      <div className="wishlist-heading">
        <h1>My Want to Play List</h1>
        <p>Games you're interested in playing.</p>
      </div>

      {error && (
        <p className="wishlist-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p role="status">Loading your Want to Play list...</p>
      ) : wishlist.length > 0 ? (
        <div className="games-grid">
          {wishlist.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onRemove={removeGame}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="wishlist-empty">
          <h2>Your list is empty</h2>
          <p>Explore games and save the ones you want to play.</p>
        </div>
      ) : null}
    </div>
  );
}

export default WantToPlayPage;
