import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('game board renders', () => {
  render(<App />);
  const gameBoard = screen.getByTestId('game-board');
  expect(gameBoard).toBeInTheDocument();
});
