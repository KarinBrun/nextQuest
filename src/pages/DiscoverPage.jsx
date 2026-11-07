import { useEffect, useState } from 'react';
import heroBanner from '../assets/hero-banner.png';
import GameFilters from '../components/games/GameFilters';
import GameCard from '../components/games/GameCard';
import {
  getGames,
  getGenres,
  getPlatforms,
} from '../services/gameService';
import './DiscoverPage.scss';

function DiscoverPage() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wait 400ms after typing before searching
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Load available genres from IGDB
  useEffect(() => {
    let active = true;

    async function loadGenres() {
      try {
        const data = await getGenres();

        if (active) {
          setGenres(data);
        }
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    }

    loadGenres();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPlatforms() {
      try {
        const data = await getPlatforms();

        if (active) {
          const allowedPlatforms = [
            'PC (Microsoft Windows)',
            'Mac',
            'Linux',
            'PlayStation 5',
            'PlayStation 4',
            'PlayStation 3',
            'PlayStation 2',
            'PlayStation',
            'PlayStation Portable',
            'PlayStation Vita',
            'Xbox Series X|S',
            'Xbox One',
            'Xbox 360',
            'Xbox',
            'Nintendo Switch 2',
            'Nintendo Switch',
            'Wii U',
            'Wii',
            'Nintendo GameCube',
            'Nintendo 64',
            'Super Nintendo Entertainment System',
            'Nintendo Entertainment System',
            'Nintendo 3DS',
            'Nintendo DS',
            'Game Boy Advance',
            'Dreamcast',
            'Sega Mega Drive/Genesis',
            'Sega Saturn',
            'Android',
            'iOS',
          ];

          const filteredPlatforms = data.filter((item) =>
            allowedPlatforms.includes(item.name)
          );

          setPlatforms(filteredPlatforms);
        }
      } catch (err) {
        console.error('Error loading platforms:', err);
      }
    }

    loadPlatforms();

    return () => {
      active = false;
    };
  }, []);

  // Fetch games when search or genre changes
  useEffect(() => {
    let active = true;

    async function loadGames() {
      setLoading(true);
      setError('');

      try {
        const data = await getGames(debouncedSearch, genre, platform);

        if (active) {
          setGames(data);
        }
      } catch (err) {
        if (active) {
          console.error('Error loading games:', err);
          setError(
            'Unable to load games. Please try again later.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      active = false;
    };
  }, [debouncedSearch, genre, platform]);

  return (
    <div className="discover-page">
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>
            Explore thousands of games and find your next favorite.
          </p>
        </div>
      </section>

      <GameFilters
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        platform={platform}
        setPlatform={setPlatform}
        genres={genres}
        platforms={platforms}
      />

      <section className="games-section">
        <h2>Explore Games</h2>

        {loading && <p>Loading games...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <div className="games-grid">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {games.length === 0 && (
              <p>No games found.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default DiscoverPage;
