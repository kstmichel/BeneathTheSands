import React, { cache } from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import App from '../../App';
import { getTotalTiles } from '../../library/utils';
// import { WormAnatomy } from '../../library/definitions';
import initialWormLocation from '../../library/data.json';

function resizeWindow(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

afterEach(() => {
  cleanup();
});

test('game board renders', () => {
  render(<App />);
  const gameBoard = screen.getByTestId('game-board');
  expect(gameBoard).toBeInTheDocument();
});

describe('GameBoard component', () => {
  describe('renders correctly at different screen sizes', () => {
    test('renders correctly at desktop size', async() => {
      act(() => {
        resizeWindow(1026, 768);
      });

      render(<App />);

      await waitFor(() => {
        const tiles = screen.getAllByTitle('grid-tile');
        const totalTiles = getTotalTiles('desktop');
  
        expect(tiles.length).toBe(totalTiles);
      });
    });

    test('renders correctly at tablet size', async() => {
      act(() => {
        resizeWindow(900, 1024);
      });

      render(<App />);

      await waitFor(() => {
        const tabletTiles = screen.getAllByTitle('grid-tile');
        const totalTiles = getTotalTiles('tablet');
        
        expect(tabletTiles.length).toBe(totalTiles);
      });
    });

    test('renders correctly at mobile size', async () => {
      act(() => {
        resizeWindow(375, 812);
      });

      render(<App />);

      await waitFor(() => {
        const tiles = screen.getAllByTitle('grid-tile');
        const totalTiles = getTotalTiles('mobile');
        expect(tiles.length).toBe(totalTiles);
      });
    });
  });

  describe('gameboard elements render correctly', () => {
    test('renders initial worm location correctly', async () => {
        render(<App />);

        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        });
    });
  })
});