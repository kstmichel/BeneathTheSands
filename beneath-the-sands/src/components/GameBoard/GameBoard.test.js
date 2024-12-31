import React, { cache } from 'react';
import { render, screen, act, cleanup, waitFor, fireEvent } from '@testing-library/react';
import App from '../../App';
import { getTotalTiles } from '../../library/utils';
import initialWormLocation from '../../library/data.json';
import { WormAnatomy } from '../../library/definitions';
import {GameContext} from '../../GameContext';

const MockGameProvider = ({ children, value }) => {
    return (
      <GameContext.Provider value={value}>
        {children}
      </GameContext.Provider>
    );
  };

const testWormData = {
    data: [
    { 
        key: 0,
        part: WormAnatomy.HEAD,
        location: { 
            row: 7, 
            column: 10
        } 
    },
    { 
        key: 1,
        part: WormAnatomy.BODY,
        location: { 
            row: 7, 
            column: 9
        } 
    }, 
    { 
        key: 2,
        part: WormAnatomy.BODY,
        location: { 
            row: 7, 
            column: 8
        } 
    },
    { 
        key: 3,
        part: WormAnatomy.TAIL,
        location: { 
            row: 7, 
            column: 7
        } 
    }
]}

function resizeWindow(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

afterEach(() => {
  cleanup();
});

test('game board renders', () => {
  render(<App {...testWormData}  />);
  const gameBoard = screen.getByTestId('game-board');
  expect(gameBoard).toBeInTheDocument();
});

describe('GameBoard component', () => {
  describe('renders correctly at different screen sizes', () => {
    test('renders correctly at desktop size', async() => {
      act(() => {
        resizeWindow(1026, 768);
      });

      render(<App {...testWormData} />);

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

      render(<App {...testWormData} />);

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

      render(<App {...testWormData} />);

      await waitFor(() => {
        const tiles = screen.getAllByTitle('grid-tile');
        const totalTiles = getTotalTiles('mobile');
        expect(tiles.length).toBe(totalTiles);
      });
    });
  });

  describe('gameboard elements render correctly', () => {
    test('renders initial worm location correctly', async () => {
        render(<App {...testWormData} />);

        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        });
    });
  })

  describe('sandworm is controlled by user input (directional arrows)', () => {
    test('sandworm moves up when top arrow key is pressed', async() => {
        render(<App {...testWormData} />)

        // wait for sandworm to render
        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        }, 1000);

         // press up arrow key
         fireEvent.keyDown(window, { key: 'ArrowUp', code: 'ArrowUp' });

         await waitFor(() => {
            const headTile = screen.getByTestId('tile-7-10');
            expect(headTile).toHaveClass('tile-texture--head');
         })
    });

    test('sandworm moves right when right arrow key is pressed', async() => {
        render(<App {...testWormData} />)

        // wait for sandworm to render
        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        }, 1000);

        // press up arrow key
        fireEvent.keyDown(window, { key: 'ArrowRight', code: 'ArrowRight' });

        await waitFor(() => {
            const headTile = screen.getByTestId('tile-7-12');
            expect(headTile).toHaveClass('tile-texture--head');
        })
    });

    test('sandworm moves down when down arrow key is pressed', async() => {
        render(<App {...testWormData} />)

        // wait for sandworm to render
        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        }, 1000);

        // press up arrow key
        fireEvent.keyDown(window, { key: 'ArrowDown', code: 'ArrowDown' });

        await waitFor(() => {
            const headTile = screen.getByTestId('tile-8-11');
            expect(headTile).toHaveClass('tile-texture--head');
        })
    });

    test('sandworm moves left when left arrow key is pressed', async() => {
        render(<App {...testWormData} />)

        // wait for sandworm to render
        await waitFor(() => {
            initialWormLocation.forEach(segment => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
        });

        // press up arrow key
        fireEvent.keyDown(window, { key: 'ArrowLeft', code: 'ArrowLeft' });

        await waitFor(() => {
            const headTile = screen.getByTestId('tile-7-9');
            expect(headTile).toHaveClass('tile-texture--head');
        })
    });

    });
});