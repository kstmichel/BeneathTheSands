import React, { cache } from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import { getTotalTiles } from '../src/library/utils';


afterEach(() => {
  cleanup();
});

test('game board renders', () => {
  render(<App />);
  const gameBoard = screen.getByTestId('game-board');
  expect(gameBoard).toBeInTheDocument();
});
