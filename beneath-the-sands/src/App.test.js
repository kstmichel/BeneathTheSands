import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import { WormAnatomy, Direction } from './library/definitions';
import '@testing-library/jest-dom'; // Ensure this import is present

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

afterEach(() => {
  cleanup();
});

describe('Game throws error when data is not provided', () => {

    test('data is not found', async () => {
      const testErrorThrownMissingDataNull = {
        data: null,
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingDataNull} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    });
    
    test('sandworm data is not found', async () => {
      const testErrorThrownMissingSandwormDataNull = {
        data: {
          sandWorm: null,
          food: foodTestLocations,
          startDirection: Direction.RIGHT,
        },
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingSandwormDataNull} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    
      const testErrorThrownMissingSandwormDataEmpty = {
        data: {
          sandWorm: [],
          food: foodTestLocations,
          startDirection: Direction.RIGHT,
        },
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingSandwormDataEmpty} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    });
    
    test('food data is not found', async () => {
      const testErrorThrownMissingFoodDataNull = {
        data: {
          sandWorm: sandWormTestLocation,
          food: null,
          startDirection: Direction.RIGHT,
        },
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingFoodDataNull} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    
      const testErrorThrownMissingFoodDataEmpty = {
        data: {
          sandWorm: sandWormTestLocation,
          food: [],
          startDirection: Direction.RIGHT,
        },
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingFoodDataEmpty} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    });


    test('start direction is not found', async () => {
      const testErrorThrownMissingStartDirectionNull = {
        data: {
          sandWorm: sandWormTestLocation,
          food: foodTestLocations,
          startDirection: null,
        },
      };
    
      await waitFor(() => {
        expect(() => render(<App {...testErrorThrownMissingStartDirectionNull} />)).toThrow('game element data not found during rendering');
      }, { timeout: 1000 });
    
    });
  

})
