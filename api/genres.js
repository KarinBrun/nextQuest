export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
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
    // Get an access token from Twitch
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

    // Retrieve available genres from IGDB
    const genresResponse = await fetch(
      'https://api.igdb.com/v4/genres',
      {
        method: 'POST',
        headers: {
          'Client-ID': clientId,
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'text/plain',
        },
        body: `
          fields id, name;
          sort name asc;
          limit 100;
        `,
      }
    );

    if (!genresResponse.ok) {
      throw new Error('Failed to fetch genres from IGDB');
    }

    const genres = await genresResponse.json();

    return res.status(200).json(genres);
  } catch (error) {
    console.error('IGDB genres error:', error);

    return res.status(500).json({
      error: 'Unable to retrieve genres',
    });
  }
}
