import React, { cache } from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import App from './App';
import { getTotalTiles } from '../src/library/utils';

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
    test('renders correctly at desktop size', () => {
      act(() => {
        resizeWindow(1026, 768);
      });

      render(<App />);
      const tiles = screen.getAllByTestId('game-tile');
      const totalTiles = getTotalTiles('desktop');

      expect(tiles.length).toBe(totalTiles);
    });

    test('renders correctly at tablet size', () => {
      act(() => {
        resizeWindow(900, 1024);
      });

      render(<App />);
      const tabletTiles = screen.getAllByTestId('game-tile');
      const totalTiles = getTotalTiles('tablet');
      
      expect(tabletTiles.length).toBe(totalTiles);
    });

    test('renders correctly at mobile size', () => {
      act(() => {
        resizeWindow(375, 812);
      });

      render(<App />);
      const tiles = screen.getAllByTestId('game-tile');
      const totalTiles = getTotalTiles('mobile');

      expect(tiles.length).toBe(totalTiles);
    });
  });
});