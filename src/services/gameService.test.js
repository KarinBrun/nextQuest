import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  getGames,
  getGameById,
  getGenres,
  getPlatforms,
} from './gameService';

describe('gameService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and normalizes games successfully', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'Test Game',
          rating: 80,
        },
      ],
    });

    const games = await getGames();

    expect(fetch).toHaveBeenCalledWith('/api/games');
    expect(games).toHaveLength(1);
    expect(games[0].name).toBe('Test Game');
    expect(games[0].rating).toBe(4);
  });

  it('encodes search and filter parameters', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getGames('  Mario & Luigi  ', '12', '6');

    expect(fetch).toHaveBeenCalledWith(
      '/api/games?search=Mario+%26+Luigi&genre=12&platform=6'
    );
  });

  it('handles a failed games request', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getGames()).rejects.toThrow(
      'Failed to fetch games from IGDB'
    );
  });

  it('fetches a game by ID', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 123,
        name: 'Game Details',
      }),
    });

    const game = await getGameById(123);

    expect(fetch).toHaveBeenCalledWith('/api/game?id=123');
    expect(game.name).toBe('Game Details');
  });

  it('returns null when a game is not found', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getGameById(999)).resolves.toBeNull();
  });

  it('handles other game details errors', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getGameById(123)).rejects.toThrow(
      'Failed to fetch game details from IGDB'
    );
  });

  it('fetches genres successfully', async () => {
    const genres = [{ id: 1, name: 'Adventure' }];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => genres,
    });

    await expect(getGenres()).resolves.toEqual(genres);
    expect(fetch).toHaveBeenCalledWith('/api/genres');
  });

  it('handles failed genre requests', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(getGenres()).rejects.toThrow(
      'Failed to fetch genres from IGDB'
    );
  });

  it('fetches platforms successfully', async () => {
    const platforms = [{ id: 6, name: 'PC' }];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => platforms,
    });

    await expect(getPlatforms()).resolves.toEqual(platforms);
    expect(fetch).toHaveBeenCalledWith('/api/platforms');
  });

  it('handles failed platform requests', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(getPlatforms()).rejects.toThrow(
      'Failed to fetch platforms from IGDB'
    );
  });
});
