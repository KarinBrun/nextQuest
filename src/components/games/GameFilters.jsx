import { Search } from 'lucide-react';
import './GameFilters.scss';

function GameFilters({
  search,
  setSearch,
  genre,
  setGenre,
  platform,
  setPlatform,
  genres = [],
  platforms = [],
}) {
  return (
    <div className="game-filters">
      <div className="search-box">
        <Search size={20} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search for games..."
          aria-label="Search for games"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        aria-label="Filter by platform"
      >
        <option value="">All Platforms</option>
        {platforms.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GameFilters;
