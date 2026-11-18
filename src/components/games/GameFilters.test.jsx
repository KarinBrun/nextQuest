import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GameFilters from './GameFilters';

describe('GameFilters', () => {
  it('displays all sorting options', () => {
    render(
      <GameFilters
        search=""
        setSearch={vi.fn()}
        genre=""
        setGenre={vi.fn()}
        platform=""
        setPlatform={vi.fn()}
        genres={[]}
        platforms={[]}
        sort="default"
        setSort={vi.fn()}
      />
    );

    const sortDropdown = screen.getByRole('combobox', {
      name: 'Sort games',
    });

    expect(sortDropdown).toHaveValue('default');

    expect(
      screen.getByRole('option', { name: 'Default Order' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'Name (A-Z)' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'Name (Z-A)' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: 'Newest First' })
    ).toBeInTheDocument();
  });

  it('updates sorting when a new option is selected', () => {
    const setSort = vi.fn();

    render(
      <GameFilters
        search=""
        setSearch={vi.fn()}
        genre=""
        setGenre={vi.fn()}
        platform=""
        setPlatform={vi.fn()}
        genres={[]}
        platforms={[]}
        sort="default"
        setSort={setSort}
      />
    );

    const sortDropdown = screen.getByRole('combobox', {
      name: 'Sort games',
    });

    fireEvent.change(sortDropdown, {
      target: { value: 'name-asc' },
    });

    expect(setSort).toHaveBeenCalledWith('name-asc');
  });
});
