import { describe, expect, it } from 'vitest';
import { normalizeGame } from './normalizeGame';

describe('normalizeGame', () => {
  const game = {
    id: 123,
    name: 'Test Game',
    cover: {
      url: '//images.igdb.com/igdb/image/upload/t_thumb/test.jpg',
    },
    rating: 80,
    summary: 'A test game description.',
    genres: [{ name: 'Adventure' }],
    platforms: [{ id: 6, name: 'PC' }],
  };

  it('normalizes valid IGDB game data', () => {
    const result = normalizeGame(game);

    expect(result.id).toBe(123);
    expect(result.name).toBe('Test Game');
    expect(result.rating).toBe(4);
    expect(result.description).toBe('A test game description.');
    expect(result.genres).toEqual(['Adventure']);
    expect(result.parent_platforms[0].platform.name).toBe('PC');
    expect(result.background_image).toBe(
      'https://images.igdb.com/igdb/image/upload/t_cover_big/test.jpg'
    );
  });

  it('rejects an image URL from an unexpected domain', () => {
    const result = normalizeGame({
      ...game,
      cover: {
        url: 'https://example.com/image.jpg',
      },
    });

    expect(result.background_image).toBeNull();
  });

  it('rejects malformed image URLs', () => {
    const result = normalizeGame({
      ...game,
      cover: {
        url: 'not-a-valid-url',
      },
    });

    expect(result.background_image).toBeNull();
  });

  it('handles missing optional game data', () => {
    const result = normalizeGame({
      id: 456,
      name: 'Incomplete Game',
    });

    expect(result.background_image).toBeNull();
    expect(result.rating).toBeNull();
    expect(result.description).toBe('No description available.');
    expect(result.genres).toEqual([]);
    expect(result.parent_platforms).toEqual([]);
    expect(result.stores).toEqual([]);
  });

  it('rejects non-HTTPS image URLs', () => {
    const result = normalizeGame({
      ...game,
      cover: {
        url: 'http://images.igdb.com/image.jpg',
      },
    });

    expect(result.background_image).toBeNull();
  });
});
