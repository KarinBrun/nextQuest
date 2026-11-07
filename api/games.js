import { featuredGameIds } from './featuredGames.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  const search =
    typeof req.query.search === 'string'
      ? req.query.search.trim()
      : '';

  const genre =
    typeof req.query.genre === 'string'
      ? req.query.genre.trim()
      : '';

  const genreId = genre ? Number(genre) : null;

  if (
    genre &&
    (!Number.isSafeInteger(genreId) || genreId <= 0)
  ) {
    return res.status(400).json({
      error: 'Invalid genre ID',
    });
  }

  const platform =
    typeof req.query.platform === 'string'
      ? req.query.platform.trim()
      : '';

  const platformId = platform ? Number(platform) : null;

  if (
    platform &&
    (!Number.isSafeInteger(platformId) || platformId <= 0)
  ) {
    return res.status(400).json({
      error: 'Invalid platform ID',
    });
  }

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'Missing Twitch credentials',
    });
  }

  try {
    // Authenticate with Twitch
    const tokenResponse = await fetch(
      'https://id.twitch.tv/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to authenticate with Twitch');
    }

    const tokenData = await tokenResponse.json();

    const headers = {
      'Client-ID': clientId,
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'text/plain',
    };

    // Fields returned for every game
    const fields = `
      fields name, cover.url, rating, first_release_date,
             summary, genres.name, platforms.name;
    `;

    // Determine whether the user is searching or filtering
    const hasFilters = Boolean(
      search || genreId !== null || platformId !== null
    );

    let query;

    if (!hasFilters) {
      // Default Discover: retrieve our curated games
      query = `
        ${fields}
        where id = (${featuredGameIds.join(',')});
        limit ${featuredGameIds.length};
      `;
    } else {
      // Search and filtering: query the IGDB catalog
      const safeSearch = search
        .slice(0, 100)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/[\r\n]/g, ' ');

      const conditions = ['cover != null'];

      if (genreId !== null) {
        conditions.push(`genres = (${genreId})`);
      }

      if (platformId !== null) {
        conditions.push(`platforms = (${platformId})`);
      }

      if (!safeSearch) {
        conditions.push('rating != null');
      }

      const whereClause = conditions.join(' & ');

      query = safeSearch
        ? `
            ${fields}
            search "${safeSearch}";
            where ${whereClause};
            limit 20;
          `
        : `
            ${fields}
            where ${whereClause};
            sort popularity desc;
            limit 20;
          `;
    }

    // Retrieve games from IGDB
    const gamesResponse = await fetch(
      'https://api.igdb.com/v4/games',
      {
        method: 'POST',
        headers,
        body: query,
      }
    );

    if (!gamesResponse.ok) {
      throw new Error('Failed to fetch games from IGDB');
    }

    const games = await gamesResponse.json();

    // Preserve our curated order on the default page
    if (!hasFilters) {
      const gamesById = new Map(
        games.map((game) => [game.id, game])
      );

      const sortedGames = featuredGameIds
        .map((id) => gamesById.get(id))
        .filter(Boolean);

      return res.status(200).json(sortedGames);
    }

    return res.status(200).json(games);
  } catch (error) {
    console.error('IGDB API error:', error);

    return res.status(500).json({
      error: 'Unable to retrieve games',
    });
  }
}
