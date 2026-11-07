export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const { id } = req.query;
  const gameId = Number(id);

  if (!Number.isSafeInteger(gameId) || gameId <= 0) {
    return res.status(400).json({
      error: 'Invalid game ID',
    });
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'Missing Twitch credentials',
    });
  }

  try {
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

    const gameResponse = await fetch(
      'https://api.igdb.com/v4/games',
      {
        method: 'POST',
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'text/plain',
        },
        body: `
          fields name, cover.url, rating, first_release_date,
                 summary, genres.name, platforms.name;
          where id = ${gameId};
          limit 1;
        `,
      }
    );

    if (!gameResponse.ok) {
      throw new Error('Failed to fetch game from IGDB');
    }

    const games = await gameResponse.json();

    if (games.length === 0) {
      return res.status(404).json({
        error: 'Game not found',
      });
    }

    return res.status(200).json(games[0]);
  } catch (error) {
    console.error('IGDB game details error:', error);

    return res.status(500).json({
      error: 'Unable to retrieve game details',
    });
  }
}
