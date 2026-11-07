import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, BookmarkPlus, X } from 'lucide-react';
import { getGameById } from '../services/gameService';
import { useWishlist } from '../context/useWishlist';
import './GameDetailsPage.scss';

function GameDetailsPage({ isModal = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addGame, removeGame, isInWishlist } = useWishlist();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const saved = game ? isInWishlist(game.id) : false;

  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    let active = true;

    async function loadGame() {
      try {
        const data = await getGameById(id);

        if (active) {
          setGame(data);
        }
      } catch (err) {
        if (active) {
          console.error('Error loading game details:', err);
          setError('Unable to load game details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGame();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        navigate(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModal, navigate]);

  let content;

  if (loading) {
    content = (
      <div className="game-details-page">
        <p>Loading game details...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="game-details-page">
        <p role="alert">{error}</p>
      </div>
    );
  } else if (!game) {
    content = (
      <div className="game-details-page">
        <h1>Game Not Found</h1>
        <p>We couldn't find the game you're looking for.</p>
      </div>
    );
  } else {
    content = (
      <div className="game-details-page">
        <div className="game-details-layout">
          <div className="game-details-cover">
            {game.background_image && (
              <img
                src={game.background_image}
                alt={game.name}
              />
            )}
          </div>

          <div className="game-details-info">
            <h1>{game.name}</h1>

            {game.rating !== null && (
              <div className="game-details-rating">
                <Star size={20} fill="currentColor" />
                <span>{game.rating.toFixed(1)} / 5</span>
              </div>
            )}

            <p className="game-description">
              {game.description}
            </p>

            <div className="game-metadata">
              <div>
                <h2>Release Date</h2>
                <p>
                  {game.released
                    ? new Date(
                        `${game.released}T00:00:00`
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>

              <div>
                <h2>Genres</h2>
                <p>
                  {game.genres.length
                    ? game.genres.join(', ')
                    : 'Not available'}
                </p>
              </div>

              <div>
                <h2>Platforms</h2>
                <p>
                  {game.parent_platforms.length
                    ? game.parent_platforms
                        .map(({ platform }) => platform.name)
                        .join(', ')
                    : 'Not available'}
                </p>
              </div>

              {game.stores.length > 0 && (
                <div>
                  <h2>Available On</h2>
                  <p>{game.stores.join(', ')}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="wishlist-button"
              onClick={() => {
                if (saved) {
                  removeGame(game.id);
                } else {
                  addGame(game);
                }
              }}
            >
              <BookmarkPlus size={20} />
              {saved ? 'Remove from Want to Play' : 'Add to Want to Play'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isModal) {
    return content;
  }

  return (
    <div
      className="game-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className="game-modal"
        role="dialog"
        aria-modal="true"
        aria-label={game?.name || 'Game details'}
      >
        <button
          type="button"
          className="game-modal-close"
          onClick={closeModal}
          aria-label="Close game details"
        >
          <X size={24} />
        </button>

        {content}
      </div>
    </div>
  );
}

export default GameDetailsPage;
