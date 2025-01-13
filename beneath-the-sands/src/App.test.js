import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import { WormAnatomy, Direction } from './library/definitions';
import {GameContext} from './GameContext'
import '@testing-library/jest-dom'; // Ensure this import is present

afterEach(() => {
  cleanup();
});

const MockGameProvider = ({ children, value }) => {
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

const baseContext = {
  wormLength: 2,
  speed: 300,
  foodEaten: 0,
  score: 0,
  level: 1,
  gameOver: false,
  gameWon: false,
  increaseScore: () => console.log("increase score"),
  increaseSpeed: () => console.log("increase speed"),
  nextLevel: () => console.log("increase level"),
  increaseWormLength: () => console.log("increase worm length"),
  increaseFoodEaten: () => console.log("increase food eaten"),
  victoryDance: () => console.log("winner"),
  oopsYouLost: () => console.log("loser"),
};

const baseWormSegments = [
  { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
  { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
  { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
  { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
];

const baseSandwormData = {
  startDirection: Direction.RIGHT,
  segments: baseWormSegments
}

const baseFoodData = [
  { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
  { key: 1, variant: 'soulFood', location: {row: 5, column: 5 }},
  { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
  { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
];

const baseLevel = {
  drops: {
      food: 10,
      coins: 5,
      rubies: 1
  }
};

const baseContextData = {
  levels: [baseLevel, baseLevel, baseLevel]
};

describe('Game throws error when data is not provided', () => {
    const errorMessage = "game element data not found during rendering";

    test('data is not found', async () => {
      const testErrorThrownMissingDataNull = {
        data: null,
      };
    
      await waitFor(() => {
        expect(() => render(
          <MockGameProvider data={testErrorThrownMissingDataNull?.context} value={baseContext}>
            <App {...testErrorThrownMissingDataNull} />
          </MockGameProvider>      
        )).toThrow(errorMessage);
      }, { timeout: 1000 });
    });
    
    describe('sandworm data is not found', () => {
      test('start direction is not found', async () => {
        const testErrorThrownMissingStartDirectionNull = {
          data: {
            game: {
              sandWorm: {
                ...baseSandwormData,
                startDirection: null,
              },
              food: baseFoodData
            },
            context: baseContextData
          }
        };
      
        await waitFor(() => {
          expect(() => render(
            <MockGameProvider data={testErrorThrownMissingStartDirectionNull.context} value={baseContext}>
              <App {...testErrorThrownMissingStartDirectionNull} />
            </MockGameProvider>      
          )).toThrow(errorMessage);
        }, { timeout: 1000 });
      
      });

      test('sandworm segments data is null', async () => {
        const testErrorThrownMissingSandwormDataNull = {
          data: {
            game: {
              sandWorm: {
                ...baseSandwormData,
                segments: null
              },
              food: baseFoodData
            },
            context: baseContextData
          }
        };
      
        await waitFor(() => {
          expect(() => render(
            <MockGameProvider data={testErrorThrownMissingSandwormDataNull.context} value={baseContext}>
              <App {...testErrorThrownMissingSandwormDataNull} />
            </MockGameProvider>      
          )).toThrow(errorMessage);
        }, { timeout: 1000 });
      });
  
      test('sandworm location array is empty', async () => {
        const testErrorThrownMissingSandwormDataNull = {
          data: {
            game: {
              sandWorm: {
                ...baseSandwormData,
                segments: []
              },
              food: baseFoodData
            },
            context: baseContextData
          }
        };
      
        await waitFor(() => {
          expect(() => render(
            <MockGameProvider data={testErrorThrownMissingSandwormDataNull.context} value={baseContext}>
              <App {...testErrorThrownMissingSandwormDataNull} />
            </MockGameProvider>      
          )).toThrow(errorMessage);
        }, { timeout: 1000 });
      
      });
      
    })
  
    describe('food data is not found', () => {
      test('food data is null', async () => {
        const testErrorThrownMissingFoodDataNull = {
          data: {
            game: {
              sandWorm: baseSandwormData,
              food: null
            },
            context: baseContextData
          }
        };

        await waitFor(() => {
          expect(() => render(
            <MockGameProvider data={testErrorThrownMissingFoodDataNull.context} value={baseContext}>
              <App {...testErrorThrownMissingFoodDataNull} />
            </MockGameProvider>      
          )).toThrow(errorMessage);
        }, { timeout: 1000 });
      });

      test('food data is empty', async () => {
        
        const testErrorThrownMissingFoodDataEmpty = {
          data: {
            game: {
              sandWorm: baseSandwormData,
              food: []
            },
            context: baseContextData
          }
        };
      
        await waitFor(() => {
          expect(() => render(
            <MockGameProvider data={testErrorThrownMissingFoodDataEmpty.context} value={baseContext}>
              <App {...testErrorThrownMissingFoodDataEmpty} />
            </MockGameProvider>      
          )).toThrow(errorMessage);
        }, { timeout: 1000 });
    });
  });
});
