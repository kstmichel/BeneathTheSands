import React from 'react';
import { render, screen, act, cleanup, waitFor, fireEvent } from '@testing-library/react';
import App from '../../App';
import { getTotalTiles } from '../../library/utils';
import { WormAnatomy } from '../../library/definitions';
import { MockGameProvider } from '../../GameContext';

/*
  AREAS TO TEST:
    Rendering the grid
    Handling user input
    Updating the game state
    Responding to different screen sizes
*/


  const testContext = {
    wormLength: 2,
    speed: 300,
    foodEaten: 0,
    score: 0,
    level: 1,
    gameOver: false,
    gameWon: false,
    increaseScore: () => console.log('increase score'),
    increaseSpeed: () => console.log('increase speed'),
    nextLevel: () => console.log('increase level'),
    increaseWormLength: () => console.log('increase worm length'),
    increaseFoodEaten: () => console.log('increase food eaten'),
    victoryDance: () => console.log('winner'),
    oopsYouLost: () => console.log('loser'),
  }

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

function resizeWindow(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

afterEach(() => {
  cleanup();
});

// Rendering
describe('Gameboard renders correctly', () => {
  describe('Renders correctly at different screen sizes', () => {
      test('Desktop screen size', async () => {
        act(() => {
          resizeWindow(1030, 768);
        });

        render(
          <MockGameProvider value={testContext}>
            <App {...testWormData} />
          </MockGameProvider>
        );

        await waitFor(() => {
          const tiles = screen.getAllByTitle('grid-tile');
          const totalTiles = getTotalTiles('desktop');

          expect(tiles.length).toBe(totalTiles);
        });
      });

      test('Tablet screen size', async () => {
        act(() => {
          resizeWindow(1000, 1024);
        });

        render(
          <MockGameProvider value={testContext}>
            <App {...testWormData} />
          </MockGameProvider>
        );

        await waitFor(() => {
          const tabletTiles = screen.getAllByTitle('grid-tile');
          const totalTiles = getTotalTiles('tablet');

          expect(tabletTiles.length).toBe(totalTiles);
        });
      });

      test('Mobile screen size', async () => {
        act(() => {
          resizeWindow(375, 812);
        });

        render(
          <MockGameProvider value={testContext}>
            <App {...testWormData} />
          </MockGameProvider>
        );

        await waitFor(() => {
          const tiles = screen.getAllByTitle('grid-tile');
          const totalTiles = getTotalTiles('mobile');
          expect(tiles.length).toBe(totalTiles);
        });
      });
  });

  test('Renders initial Sandworm location', async () => {
        render(<App {...testWormData} />);

        await waitFor(() => {
            sandWormTestLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        });
    });
  })

  

  // describe('sandworm is controlled by user input (directional arrows)', () => {
  //   test('sandworm moves up when top arrow key is pressed', async() => {
  //       render(<App {...testWormData} />)

  //       // wait for sandworm to render
  //       await waitFor(() => {
  //           initialWormLocation.forEach(segment => {
  //               const { row, column } = segment.location;
  //               const tile = screen.getByTestId(`tile-${row}-${column}`);
  //               expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
  //           });
  //       }, 1000);

  //        // press up arrow key
  //        fireEvent.keyDown(window, { key: 'ArrowUp', code: 'ArrowUp' });

  //        await waitFor(() => {
  //           const headTile = screen.getByTestId('tile-7-10');
  //           expect(headTile).toHaveClass('tile-texture--head');
  //        })
  //   });

  //   test('sandworm moves right when right arrow key is pressed', async() => {
  //       render(<App {...testWormData} />)

  //       // wait for sandworm to render
  //       await waitFor(() => {
  //           initialWormLocation.forEach(segment => {
  //               const { row, column } = segment.location;
  //               const tile = screen.getByTestId(`tile-${row}-${column}`);
  //               expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
  //           });
  //       }, 1000);

  //       // press up arrow key
  //       fireEvent.keyDown(window, { key: 'ArrowRight', code: 'ArrowRight' });

  //       await waitFor(() => {
  //           const headTile = screen.getByTestId('tile-7-12');
  //           expect(headTile).toHaveClass('tile-texture--head');
  //       })
  //   });

  //   test('sandworm moves down when down arrow key is pressed', async() => {
  //       render(<App {...testWormData} />)

  //       // wait for sandworm to render
  //       await waitFor(() => {
  //           initialWormLocation.forEach(segment => {
  //               const { row, column } = segment.location;
  //               const tile = screen.getByTestId(`tile-${row}-${column}`);
  //               expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
  //           });
  //       }, 1000);

  //       // press up arrow key
  //       fireEvent.keyDown(window, { key: 'ArrowDown', code: 'ArrowDown' });

  //       await waitFor(() => {
  //           const headTile = screen.getByTestId('tile-8-11');
  //           expect(headTile).toHaveClass('tile-texture--head');
  //       })
  //   });

  //   test('sandworm moves left when left arrow key is pressed', async() => {
  //       render(<App {...testWormData} />)

  //       // wait for sandworm to render
  //       await waitFor(() => {
  //           initialWormLocation.forEach(segment => {
  //               const { row, column } = segment.location;
  //               const tile = screen.getByTestId(`tile-${row}-${column}`);
  //               expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
  //           });
  //       });

  //       // press up arrow key
  //       fireEvent.keyDown(window, { key: 'ArrowLeft', code: 'ArrowLeft' });

  //       await waitFor(() => {
  //           const headTile = screen.getByTestId('tile-7-9');
  //           expect(headTile).toHaveClass('tile-texture--head');
  //       })
  //   });

  // });
