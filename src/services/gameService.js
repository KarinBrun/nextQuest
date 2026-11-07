import { normalizeGame } from './normalizeGame';

export async function getGames(
  search = '',
  genre = '',
  platform = ''
) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (genre !== '') {
    params.set('genre', genre);
  }

  if (platform !== '') {
    params.set('platform', platform);
  }

  const url = params.toString()
    ? `/api/games?${params.toString()}`
    : '/api/games';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch games from IGDB');
  }

  const games = await response.json();

  return games.map(normalizeGame);
}

export async function getGameById(id) {
  const response = await fetch(
    `/api/game?id=${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error('Failed to fetch game details from IGDB');
  }

  const game = await response.json();

  return normalizeGame(game);
}

export async function getGenres() {
  const response = await fetch('/api/genres');

  if (!response.ok) {
    throw new Error('Failed to fetch genres from IGDB');
  }

  return response.json();
}

export async function getPlatforms() {
  const response = await fetch('/api/platforms');

  if (!response.ok) {
    throw new Error('Failed to fetch platforms from IGDB');
  }

  return response.json();
}
