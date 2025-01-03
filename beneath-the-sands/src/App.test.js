import React, { cache } from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import { getTotalTiles } from '../src/library/utils';
import { WormAnatomy } from './library/definitions';

const sandWormTestLocation = [
  {
    key: 0,
    part: WormAnatomy.HEAD,
    location: { row: 7, column: 10 },
  },
  {
    key: 1,
    part: WormAnatomy.BODY,
    location: { row: 7, column: 9 },
  },
  {
    key: 2,
    part: WormAnatomy.BODY,
    location: { row: 7, column: 8 },
  },
  {
    key: 3,
    part: WormAnatomy.TAIL,
    location: { row: 7, column: 7 },
  },
];

const foodTestLocations = [
  { row: 3, col: 3 },
  { row: 5, col: 7 },
  { row: 8, col: 1 },
  { row: 9, col: 9 },
];

const testWormData = {
  data: {
    sandWorm: sandWormTestLocation,
    food: foodTestLocations
  }
};


afterEach(() => {
  cleanup();
});

test('Game board renders', () => {
  render(<App {...testWormData} />);

  const gameBoard = screen.getByTestId('game-board');
  expect(gameBoard).toBeInTheDocument();
});
