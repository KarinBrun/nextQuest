import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DiscoverPage from './DiscoverPage';
import { getGames, getGenres, getPlatforms } from '../services/gameService';

vi.mock('../services/gameService', () => ({
  getGames: vi.fn(),
  getGenres: vi.fn(),
  getPlatforms: vi.fn(),
}));

vi.mock('../components/games/GameCard', () => ({
  default: ({ game }) => <div data-testid="game-card">{game.name}</div>,
}));

const mockGames = [
  { id: 1, name: 'Zelda', released: '2023-05-12' },
  { id: 2, name: 'Animal Crossing', released: '2020-03-20' },
  { id: 3, name: 'Minecraft', released: '2011-11-18' },
  { id: 4, name: 'Upcoming Game', released: null },
];

describe('DiscoverPage sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getGames.mockResolvedValue(mockGames);
    getGenres.mockResolvedValue([]);
    getPlatforms.mockResolvedValue([]);
  });

  it('displays games in the default order', async () => {
    render(<DiscoverPage />);

    const cards = await screen.findAllByTestId('game-card');

    expect(cards.map((card) => card.textContent)).toEqual([
      'Zelda',
      'Animal Crossing',
      'Minecraft',
      'Upcoming Game',
    ]);
  });

  it('sorts games alphabetically from A to Z', async () => {
    render(<DiscoverPage />);

    await screen.findAllByTestId('game-card');

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Sort games' }),
      { target: { value: 'name-asc' } }
    );

    const cards = screen.getAllByTestId('game-card');

    expect(cards.map((card) => card.textContent)).toEqual([
      'Animal Crossing',
      'Minecraft',
      'Upcoming Game',
      'Zelda',
    ]);
  });

  it('sorts games alphabetically from Z to A', async () => {
    render(<DiscoverPage />);

    await screen.findAllByTestId('game-card');

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Sort games' }),
      { target: { value: 'name-desc' } }
    );

    const cards = screen.getAllByTestId('game-card');

    expect(cards.map((card) => card.textContent)).toEqual([
      'Zelda',
      'Upcoming Game',
      'Minecraft',
      'Animal Crossing',
    ]);
  });

  it('sorts games by newest release date first', async () => {
    render(<DiscoverPage />);

    await screen.findAllByTestId('game-card');

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Sort games' }),
      { target: { value: 'newest' } }
    );

    const cards = screen.getAllByTestId('game-card');

    expect(cards.map((card) => card.textContent)).toEqual([
      'Zelda',
      'Animal Crossing',
      'Minecraft',
      'Upcoming Game',
    ]);
  });

  it('does not refetch games when sorting changes', async () => {
    render(<DiscoverPage />);

    await screen.findAllByTestId('game-card');

    expect(getGames).toHaveBeenCalledTimes(1);

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Sort games' }),
      { target: { value: 'name-asc' } }
    );

    expect(getGames).toHaveBeenCalledTimes(1);
  });
});
