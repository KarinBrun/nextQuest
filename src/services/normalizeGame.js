function normalizeCoverUrl(coverUrl) {
  if (typeof coverUrl !== 'string') {
    return null;
  }

  try {
    const url = new URL(
      coverUrl.startsWith('//') ? `https:${coverUrl}` : coverUrl
    );

    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'images.igdb.com'
    ) {
      return null;
    }

    url.pathname = url.pathname.replace(
      't_thumb',
      't_cover_big'
    );

    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeGame(game) {
  return {
    id: game.id,
    name: game.name,

    background_image: normalizeCoverUrl(game.cover?.url),

    rating: typeof game.rating === 'number'
      ? Number((game.rating / 20).toFixed(1))
      : null,

    released: game.first_release_date
      ? new Date(game.first_release_date * 1000)
          .toISOString()
          .split('T')[0]
      : null,

    description: game.summary || 'No description available.',

    genres: game.genres?.map((genre) => genre.name) || [],

    parent_platforms:
      game.platforms?.map((platform) => ({
        platform: {
          id: platform.id,
          name: platform.name,
        },
      })) || [],

    stores: [],
  };
}
