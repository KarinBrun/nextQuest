export const mockGames = [
  {
    id: 1,
    name: 'Elden Ring',
    background_image:
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
    rating: 4.5,
    released: '2022-02-25',
    description:
      'Explore a vast fantasy world filled with challenging enemies, mysterious locations, and powerful bosses. Create your own character and discover the secrets of the Lands Between.',
    genres: ['Action', 'RPG'],
    parent_platforms: [
      { platform: { id: 1, name: 'PC' } },
      { platform: { id: 2, name: 'PlayStation' } },
      { platform: { id: 3, name: 'Xbox' } },
    ],
    stores: ['Steam', 'PlayStation Store', 'Xbox Store'],
  },
  {
    id: 2,
    name: 'The Witcher 3: Wild Hunt',
    background_image:
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    rating: 4.7,
    released: '2015-05-19',
    description:
      'Play as Geralt of Rivia, a monster hunter searching for his adopted daughter in a world filled with dangerous creatures, political conflict, and meaningful choices.',
    genres: ['Action', 'RPG'],
    parent_platforms: [
      { platform: { id: 1, name: 'PC' } },
      { platform: { id: 2, name: 'PlayStation' } },
    ],
    stores: ['Steam', 'GOG', 'PlayStation Store'],
  },
  {
    id: 3,
    name: 'Hollow Knight',
    background_image:
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg',
    rating: 4.6,
    released: '2017-02-24',
    description:
      'Explore the mysterious underground kingdom of Hallownest in this atmospheric action-adventure game. Discover hidden areas, battle challenging enemies, and uncover an ancient story.',
    genres: ['Action', 'Adventure', 'Platformer'],
    parent_platforms: [
      { platform: { id: 1, name: 'PC' } },
      { platform: { id: 4, name: 'Nintendo' } },
    ],
    stores: ['Steam', 'Nintendo eShop'],
  },
  {
    id: 4,
    name: 'Stardew Valley',
    background_image:
      'https://images.igdb.com/igdb/image/upload/t_cover_big/co49pm.jpg',
    rating: 4.4,
    released: '2016-02-26',
    description:
      'Build a new life in the countryside by growing crops, raising animals, fishing, mining, and forming friendships with the residents of Pelican Town.',
    genres: ['Simulation', 'RPG'],
    parent_platforms: [
      { platform: { id: 1, name: 'PC' } },
      { platform: { id: 4, name: 'Nintendo' } },
    ],
    stores: ['Steam', 'Nintendo eShop'],
  },
];
