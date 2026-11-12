import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useState } from 'react';
import './GameCard.scss';

function GameCard({ game, onRemove }) {
  const location = useLocation();

  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (removing || !onRemove) return;

    setRemoving(true);

    try {
      await onRemove(game.id);
    } finally {
      setRemoving(false);
    }
  };

  const platforms = game.parent_platforms || [];
  const visiblePlatforms = platforms.slice(0, 3);
  const remainingPlatforms = platforms.length - visiblePlatforms.length;

  return (
    <div className="game-card">
      <Link
        to={`/games/${game.id}`}
        state={{ backgroundLocation: location }}
        className="game-card-link"
      >
        <div className="game-card-image">
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
          />
        </div>

        <div className="game-card-content">
          <h3>{game.name}</h3>

          <div className="game-card-details">
            <span className="game-rating">
              <Star size={16} fill="currentColor" />
              {game.rating != null
                ? game.rating.toFixed(1)
                : 'N/A'}
            </span>

            <div className="game-platforms">
              {visiblePlatforms.map(({ platform }, index) => (
                <span key={platform.id ?? index}>
                  {platform.name}
                </span>
              ))}

              {remainingPlatforms > 0 && (
                <span className="platform-more">
                  +{remainingPlatforms} more
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {onRemove && (
        <div className="game-card-actions">
          <button
            type="button"
            className="remove-game-button"
            onClick={handleRemove}
            disabled={removing}
            aria-label={`Remove ${game.name} from Want to Play`}
          >
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameCard;
