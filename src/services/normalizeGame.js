export function normalizeGame(game) {
  return {
    id: game.id,
    name: game.name,

    background_image: game.cover?.url
      ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
      : null,

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
