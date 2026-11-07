import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import GameCard from './GameCard';

describe('GameCard', () => {
  const mockGame = {
    id: 119133,
    name: 'Elden Ring',
    background_image: 'https://example.com/elden-ring.jpg',
    rating: 4.8,
    parent_platforms: [
      {
        platform: {
          id: 6,
          name: 'PC (Microsoft Windows)',
        },
      },
      {
        platform: {
          id: 167,
          name: 'PlayStation 5',
        },
      },
    ],
  };

  it('displays the game name, rating, and platforms', () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Elden Ring')
    ).toBeInTheDocument();

    expect(
      screen.getByText('4.8')
    ).toBeInTheDocument();

    expect(
      screen.getByText('PlayStation 5')
    ).toBeInTheDocument();
  });

  it('links to the correct game details page', () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute(
      'href',
      '/games/119133'
    );
  });
});
