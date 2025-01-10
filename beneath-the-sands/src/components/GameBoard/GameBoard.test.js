/**
 * Test suite for the GameBoard component.
 * 
 * This suite includes tests for:
 * - Responding to different screen sizes
 * - Rendering the grid
 * - Handling user input
 * - Sandworm default behavior
 * - Food Interacting Effects
 * 
 * Device Screen Sizes:
 * - Desktop: 1030x768
 * - Tablet: 1000x1024
 * - Mobile: 375x812
 *
 * Test Data:
 * - Sandworm initial location
 * - Food initial locations
 * - Start direction
 * 
 * Utility Functions:
 * - resizeWindow(width, height): Resizes the window to the specified width and height.
 */

import React from "react";

import {
  render,
  screen,
  act,
  cleanup,
  waitFor,
  fireEvent,
} from "@testing-library/react";

import App from "../../App";

import {
  GameDimensions,
  Device,
  Direction,
  WormAnatomy,
} from "../../library/definitions";
import "@testing-library/jest-dom"; 
import { GameContext } from '../../GameContext';

const MockGameProvider = ({ children, value }) => {
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

jest.useFakeTimers();

const desktopDimensions = {width: 1030, height: 768};
const tabletDimensions = {width: 1000, height: 1024};
const mobileDimensions = {width: 655, height: 812};

function resizeWindow({width, height}) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
}

afterEach(() => {
  cleanup();
});


const testContext = {
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


// Rendering
describe("Gameboard Rendering", () => {
  describe("Displays correct number of tiles", () => {
    test("Desktop screen size", async () => {
      act(() => {
        resizeWindow(desktopDimensions);
      });

      const testWormData = {
        data: {
          sandWorm: [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ],
          food: [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ],
          startDirection: Direction.RIGHT,
        },
      };

      render(<App {...testWormData} />);

      await waitFor(() => {
        const tiles = screen.getAllByTitle("grid-tile");
        const totalTiles = GameDimensions[Device.Desktop].rows * GameDimensions[Device.Desktop].columns;

        expect(tiles.length).toBe(totalTiles);
      });
    });

    test("Tablet screen size", async () => {
      act(() => {
        resizeWindow(tabletDimensions);
      });

      const testWormData = {
        data: {
          sandWorm: [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ],
          food: [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ],
          startDirection: Direction.RIGHT,
        },
      };

      render(<App {...testWormData} />);

      await waitFor(() => {
        const tabletTiles = screen.getAllByTitle("grid-tile");
        const totalTiles = GameDimensions[Device.Tablet].rows * GameDimensions[Device.Tablet].columns;

        expect(tabletTiles.length).toBe(totalTiles);
      });
    });

    test("Mobile screen size", async () => {
      act(() => {
        resizeWindow(mobileDimensions);
      });

      const testWormData = {
        data: {
          sandWorm: [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ],
          food: [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ],
          startDirection: Direction.RIGHT,
        },
      };

      render(<App {...testWormData} />);

      await waitFor(() => {
        const tiles = screen.getAllByTitle("grid-tile");
        const totalTiles = GameDimensions[Device.Mobile].rows * GameDimensions[Device.Mobile].columns;
        expect(tiles.length).toBe(totalTiles);
      });
    });
  });

  describe("Renders board elements correctly", () => {
    it("renders initial Sandworm location", async () => {
      act(() => {
        resizeWindow(desktopDimensions);
      });

      const testWormData = {
        data: {
          sandWorm: [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ],
          food: [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ],
          startDirection: Direction.RIGHT,
        },
      };

      render(<App {...testWormData} />);

      await waitFor(() => {
        testWormData.data.sandWorm.forEach((segment) => {
          const { row, column } = segment.location;
          const tile = screen.getByTestId(`tile-${row}-${column}`);
          expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
        });
      });
    });

    it("renders initial food locations", async () => {
      act(() => {
        resizeWindow(desktopDimensions);
      });

      const testWormData = {
        data: {
          sandWorm: [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ],
          food: [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ],
          startDirection: Direction.RIGHT,
        },
      };

      render(<App {...testWormData} />);

      await waitFor(() => {
        testWormData.data.food.forEach((food) => {
          const { row, column } = food.location;

          const tile = screen.getByTestId(`tile-${row}-${column}`);
          expect(tile).toHaveClass(`tile-texture--food`);
        });
      });
    });
  });

  });

  describe("Sandworm Behavior", () => {
    describe("Default Behavior (No Input)", () => {
      // Default Behavior Tests

      // TODO: add initial worm direction to the game context and use in this test
      it("continues to move in current direction", async () => {
        /*  GIVEN the board renders, 
            WHEN no input is detected, 
            THEN the sandworm should continue to move in current direction 
            AND sandworm maintains a solid line.  */

        // NOTE: This test assumes sandworm is moving to the right

        act(() => {
          resizeWindow(desktopDimensions);
        });

        const testWormData = {
          data: {
            sandWorm: [
              { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
              { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
              { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
              { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
            ],
            food: [
              { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
              { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
              { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
              { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
            ],
            startDirection: Direction.RIGHT,
          },
        };
  
        render(<App {...testWormData} />);

        // set initial sandworm head column position
        let nextColumn = testWormData.data.sandWorm[0].location.column;

        // wait for sandworm to render
        await waitFor(() => {
          testWormData.data.sandWorm.forEach((segment) => {
            const { row, column } = segment.location;
            const tile = screen.getByTestId(`tile-${row}-${column}`);
            expect(tile).toHaveClass(
              `tile-texture--${segment.part.toLowerCase()}`
            );
          });

          nextColumn += 1; // sandworm was rendered, bump column for next check
        });

        // wait one sandworm move
        act(() => {
          jest.advanceTimersByTime(testContext.speed);
        });

        await waitFor(
          () => {
            // wait for sandworm to move

            testWormData.data.sandWorm.forEach((segment) => {
              const tile = screen.getByTestId(
                `tile-${segment.location.row}-${nextColumn}`
              );
              expect(tile).toHaveClass(
                `tile-texture--${segment.part.toLowerCase()}`
              );

              nextColumn -= 1; //as we check the sandworm segments move back one column
            });
          },
          { timeout: 500 }
        );
      });

      it("changes direction when it hits a boundary", async () => {
        /*  GIVEN the board renders,
            WHEN the sandworm hits wall 
            THEN direction options are validated
            AND sandworm moves in a random direction
        */

        act(() => {
          resizeWindow(desktopDimensions);
        });

        // Setup Sandworm initial location to right before boundary wall (right)
        let maxColumn = GameDimensions["desktop"].columns;

        const boundaryTestData = {
          data: {
            sandWorm: [
              { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
              { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
              { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
              { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
            ],
            food: [
              { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
              { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
              { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
              { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
            ],
            startDirection: Direction.RIGHT,
          },
        };

        let sandwormApproachingBoundary = boundaryTestData.data.sandWorm.map(
          (segment) => {
            let updatedSegment = { ...segment };
            updatedSegment.location.column = maxColumn - 1; // set to last column to the right
            maxColumn -= 1; // decrease by one as we update segment locations

            return updatedSegment;
          }
        );

        const testWormHitBoundaryData = {
          ...boundaryTestData,
          sandWorm: sandwormApproachingBoundary,
        };

        let testCoordinates = { ...sandwormApproachingBoundary[0].location }; // initialize test coordinates

        render(<App {...boundaryTestData} />);

        // wait for sandworm to render
        await waitFor(() => {
          testWormHitBoundaryData.data.sandWorm.forEach((segment) => {
            const { row, column } = segment.location;
            const tile = screen.getByTestId(`tile-${row}-${column}`);
            expect(tile).toHaveClass(
              `tile-texture--${segment.part.toLowerCase()}`
            );
          });
        });

        // wait one sandworm move
        act(() => {
          jest.advanceTimersByTime(testContext.speed);
        });

        const head = { ...testWormHitBoundaryData.data.sandWorm[0] };
        const testTileUp = 6;
        const testTileDown = 8;

        if (head.location.row > testCoordinates.row) {
          testCoordinates = { ...testCoordinates, row: testTileDown };
        } else if (head.location.row < testCoordinates.row) {
          testCoordinates = { ...testCoordinates, row: testTileUp };
        }

        await waitFor(() => {
          // check that sandworm moved accurately based on direction
          testWormHitBoundaryData.data.sandWorm.forEach((segment) => {
            if (segment.part !== "head") {
              // the rest of the segments just move once to the right
              testCoordinates = { ...segment.location };
            }

            const tile = screen.getByTestId(
              `tile-${testCoordinates.row}-${testCoordinates.column}`
            );

            expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
          });
        });
      });
    });

    describe("Input Behavior", () => {
      describe(`Change direction when upon valid input`, () => {
        it("moves up when UP arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopDimensions);
          });

          const boundaryTestData = {
            data: {
              sandWorm: [
                { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
                { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
                { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
              ],
              food: [
                { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
              ],
              startDirection: Direction.RIGHT,
            },
          };

          render(
              <App {...boundaryTestData} />
          );

          // wait for sandworm to render
          await waitFor(() => {
            boundaryTestData.data.sandWorm.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(
                `tile-texture--${segment.part.toLowerCase()}`
              );
            });
          }, 1000);

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });

          await waitFor(() => {
            const headTile = screen.getByTestId("tile-6-10");
            expect(headTile).toHaveClass("tile-texture--head");
          });
        });

        it("moves right when RIGHT arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopDimensions);
          });

          const gameTestDataMoveRight = {
            data: {
              sandWorm: [
                { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
                { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
                { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
              ],
              food: [
                { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
              ],
              startDirection: Direction.RIGHT,
            },
          };

          render(
              <App {...gameTestDataMoveRight} />
          );

          // wait for sandworm to render
          await waitFor(() => {
            gameTestDataMoveRight.data.sandWorm.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          }, 1000);

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });

          // wait one sandworm move
          act(() => {
            jest.advanceTimersByTime(testContext.speed * 2);
          });
          
          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 7, column: 12 },
              { row: 7, column: 11 },
              { row: 7, column: 10 },
              { row: 7, column: 9 }
            ];

            gameTestDataMoveRight.data.sandWorm.forEach((segment, index) => {
                const {row, column} = testSegmentValidLocation[index];
                const tile = screen.getByTestId(`tile-${row}-${column}`);

                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });
        });

        it("moves down when DOWN arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopDimensions);
          });

          const boundaryTestData = {
            data: {
              sandWorm: [
                { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
                { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
                { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
              ],
              food: [
                { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
              ],
              startDirection: Direction.RIGHT,
            },
          };

          render(
              <App {...boundaryTestData} />
          );

          // wait for sandworm to render
          await waitFor(() => {
            boundaryTestData.data.sandWorm.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(
                `tile-texture--${segment.part.toLowerCase()}`
              );
            });
          }, 1000);

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowDown", code: "ArrowDown" });

           // wait one sandworm move
           act(() => {
            jest.advanceTimersByTime(testContext.speed * 1);
          });

          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 9, column: 10 },
              { row: 8, column: 10 },
              { row: 7, column: 10 },
              { row: 7, column: 9 }
            ];

            boundaryTestData.data.sandWorm.forEach((segment, index) => {
                const {row, column} = testSegmentValidLocation[index];
                const tile = screen.getByTestId(`tile-${row}-${column}`);

                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });
        });

        it("moves left when LEFT arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopDimensions);
          });

          const leftArrowTestData = {
            data: {
              sandWorm: [
                { key: 0, part: WormAnatomy.HEAD, location: { row: 5, column: 9 } },
                { key: 1, part: WormAnatomy.BODY, location: { row: 6, column: 9 } },
                { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                { key: 3, part: WormAnatomy.TAIL, location: { row: 8, column: 9 } },
              ],
              food: [
                { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
              ],
              startDirection: Direction.UP,
            },
          };

          render(
              <App {...leftArrowTestData} />
          );

          // wait for sandworm to render
          await waitFor(() => {
            leftArrowTestData.data.sandWorm.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(
                `tile-texture--${segment.part.toLowerCase()}`
              );
            });
          }, 1000);

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });

          // wait one sandworm move
          act(() => {
            jest.advanceTimersByTime(testContext.speed * 1);
          });
          
          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 5, column: 8 },
              { row: 5, column: 9 },
              { row: 6, column: 9 },
              { row: 7, column: 9 }
            ];

            leftArrowTestData.data.sandWorm.forEach((segment, index) => {
                const {row, column} = testSegmentValidLocation[index];
                const tile = screen.getByTestId(`tile-${row}-${column}`);
;               expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });
        });
      });

      describe('Continue in current direction upon invalid input', () => {
          it("does not reverse direction", async () => {

              /* GIVEN the board renders,
                 WHEN user input is detected
                 AND next move is invalid as it is in the opposite direction
                 THEN continue moving sandworm in current direction  */

                act(() => {
                  resizeWindow(desktopDimensions);
                });

                const oppositeDirectionTest = {
                  data: {
                    sandWorm: [
                      { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
                      { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                      { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
                      { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
                    ],
                    food: [
                      { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                      { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                      { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                      { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
                    ],
                    startDirection: Direction.RIGHT,
                  },
                };

                render(
                    <App {...oppositeDirectionTest} />
                );
        
                // wait for sandworm to render
                await waitFor(() => {
                  oppositeDirectionTest.data.sandWorm.forEach((segment) => {
                    const { row, column } = segment.location;
                    const tile = screen.getByTestId(`tile-${row}-${column}`);
                    expect(tile).toHaveClass(
                      `tile-texture--${segment.part.toLowerCase()}`
                    );
                  });
                }, 1000);
        
                // press left arrow key
                fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
        
                // ASSERT (invalid) The sandworm head did not turn left on top of it's own body
                await waitFor(() => {
                  const headTile = screen.getByTestId("tile-7-9");
                  expect(headTile).not.toHaveClass("tile-texture--head");
                });

                // ASSERT (valid) The sandworm head continued in the direction it was going
                await waitFor(() => {
                  const testSegmentValidLocation = [
                    { row: 7, column: 11 },
                    { row: 7, column: 10 },
                    { row: 7, column: 9 },
                    { row: 7, column: 8 }
                  ];
                  
                  oppositeDirectionTest.data.sandWorm.forEach((segment, index) => {
                      const {row, column} = testSegmentValidLocation[index];
                      const tile = screen.getByTestId(`tile-${row}-${column}`);

                      expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                  });
                });
            
          });

          it('does not move into a wall', async () => {
              /*  GIVEN the board renders,
                  WHEN user input is detected
                  AND next move is invalid as it collides with boundary
                  THEN continue moving sandworm in current direction  */

                  act(() => {
                    resizeWindow(desktopDimensions);
                  });
  
                  const collideWithWallTest = {
                    data: {
                      sandWorm: [
                        { key: 0, part: WormAnatomy.HEAD, location: { row: 14, column: 10 } },
                        { key: 2, part: WormAnatomy.BODY, location: { row: 14, column: 8 } },
                        { key: 1, part: WormAnatomy.BODY, location: { row: 14, column: 9 } },
                        { key: 3, part: WormAnatomy.TAIL, location: { row: 14, column: 7 } },
                      ],
                      food: [
                        { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                        { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                        { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                        { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
                      ],
                      startDirection: Direction.RIGHT,
                    },
                  };

                  //ARRANGE
                  render(
                    <App {...collideWithWallTest} />
                  );
          
                  // wait for sandworm to render
                  await waitFor(() => {
                    collideWithWallTest.data.sandWorm.forEach((segment) => {
                      const { row, column } = segment.location;
                      const tile = screen.getByTestId(`tile-${row}-${column}`);
                      expect(tile).toHaveClass(
                        `tile-texture--${segment.part.toLowerCase()}`
                      );
                    });
                  }, 1000);
          
                  // ACT: press down arrow key into bottom wall boundary
                  fireEvent.keyDown(window, { key: "ArrowDown", code: "ArrowDown" });
  
                  // ASSERT (valid behavior): The sandworm head continued in the direction it was going
                  await waitFor(() => {
                    const testSegmentValidLocation = [
                      { row: 14, column: 11 },
                      { row: 14, column: 10 },
                      { row: 14, column: 9 },
                      { row: 14, column: 8 }
                    ];

                    collideWithWallTest.data.sandWorm.forEach((segment, index) => {
                        const {row, column} = testSegmentValidLocation[index];
                        const tile = screen.getByTestId(`tile-${row}-${column}`);
  
                        expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                    });
                  });
          });
      });
    });

    describe('Food Interaction Effects (Context Tests)', () => {
        test('the sandworm grows in length after eating food', async () => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND increases body length by 1  */

              act(() => {
                resizeWindow(desktopDimensions);
              });

              let testLengthIncreaseContext = {
                  wormLength: 4,
                  speed: 300,
                  foodEaten: 0,
                  score: 0,
                  level: 1,
                  gameOver: false,
                  gameWon: false,
                  increaseFoodEaten: () => {
                    testLengthIncreaseContext.foodEaten += 1;
                    testLengthIncreaseContext.increaseWormLength();
                    testLengthIncreaseContext.increaseScore();
                    testLengthIncreaseContext.increaseSpeed();
                  },
                  increaseWormLength: () => {
                    testLengthIncreaseContext.wormLength += 1;
                  },
                  increaseScore: () => {
                    testLengthIncreaseContext.score += 100;
                  },
                  increaseSpeed: () => {
                    testLengthIncreaseContext.speed -= 50;
                  },
                  nextLevel: () => console.log("increase level"),
                  victoryDance: () => console.log("winner"),
                  oopsYouLost: () => console.log("loser"),
              };

              const growInLengthTestData = {
                data: {
                  sandWorm: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                  ],
                  food: [
                    { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                    { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                    { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                    { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                  ],
                  startDirection: Direction.RIGHT,
                },
              };

              render(
                <MockGameProvider value={testLengthIncreaseContext}>
                  <App {...growInLengthTestData} />
                </MockGameProvider>
              );

              // wait for sandworm to render
              await waitFor(() => {
                growInLengthTestData.data.sandWorm.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(testContext.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = growInLengthTestData.data.food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                testLengthIncreaseContext.increaseFoodEaten();
              })

              const assertWormLength = 5; 

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {                
                expect(testLengthIncreaseContext.wormLength).toEqual(assertWormLength);
              });

              //assert new sandworm length renders in gameboard
              await waitFor(() => {
                const headTile = screen.getAllByTestId('tile-type-head');
                const bodyTiles = screen.getAllByTestId('tile-type-body');
                const tailTile = screen.getAllByTestId('tile-type-tail');
                const totalRenderedSandwormTiles = headTile.length + bodyTiles.length + tailTile.length;

                expect(totalRenderedSandwormTiles).toStrictEqual(assertWormLength);
              });
        });

        test('the score increasing after eating food', async() => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND the score increases by 100 */

              act(() => {
                resizeWindow(desktopDimensions);
              });

              let testLengthIncreaseContext = {
                wormLength: 4,
                speed: 300,
                foodEaten: 0,
                score: 0,
                level: 1,
                gameOver: false,
                gameWon: false,
                increaseFoodEaten: () => increaseFoodEatenTest(),
                nextLevel: () => console.log("increase level"),
                victoryDance: () => console.log("winner"),
                oopsYouLost: () => console.log("loser"),
              };

              const increaseFoodEatenTest = () => {
                testLengthIncreaseContext.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();
              }
          
              const increaseWormLength = () => testLengthIncreaseContext.wormLength += 1;
              const increaseScore = () => testLengthIncreaseContext.score += 100;
              const increaseSpeed = () => testLengthIncreaseContext.speed -= 50;

              const increaseScoreTest = {
                data: {
                  sandWorm: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                  ],
                  food: [
                    { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                    { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                    { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                    { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                  ],
                  startDirection: Direction.RIGHT,
                },
              };

              render(
                <MockGameProvider value={testLengthIncreaseContext}>
                  <App {...increaseScoreTest} />
                </MockGameProvider>
              );

              // wait for sandworm to render
              await waitFor(() => {
                increaseScoreTest.data.sandWorm.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(testContext.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = increaseScoreTest.data.food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                testLengthIncreaseContext.increaseFoodEaten();
              })

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {
                const assertScore = 100; 
                expect(testLengthIncreaseContext.score).toEqual(assertScore);
              });
        });

        it('speed increases after eating food', async() => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND the speed increases by 50ms */

              act(() => {
                resizeWindow(desktopDimensions);
              });

              const increaseSpeedTest = {
                data: {
                  sandWorm: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                  ],
                  food: [
                    { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                    { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                    { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                    { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                  ],
                  startDirection: Direction.RIGHT,
                },
              };

              let testLengthIncreaseContext = {
                wormLength: 4,
                speed: 300,
                foodEaten: 0,
                score: 0,
                level: 1,
                gameOver: false,
                gameWon: false,
                increaseFoodEaten: () => increaseFoodEatenTest(),
                nextLevel: () => console.log("increase level"),
                victoryDance: () => console.log("winner"),
                oopsYouLost: () => console.log("loser"),
              };

              const increaseFoodEatenTest = () => {
                testLengthIncreaseContext.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();
              }
          
              const increaseWormLength = () => testLengthIncreaseContext.wormLength += 1;
              const increaseScore = () => testLengthIncreaseContext.score += 100;
              const increaseSpeed = () => testLengthIncreaseContext.speed -= 50;

              render(
                <MockGameProvider value={testLengthIncreaseContext}>
                  <App {...increaseSpeedTest} />
                </MockGameProvider>
              );

              // wait for sandworm to render
              await waitFor(() => {
                increaseSpeedTest.data.sandWorm.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(testContext.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = increaseSpeedTest.data.food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                testLengthIncreaseContext.increaseFoodEaten();
              })

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {
                const assertSpeed = 250; 
                expect(testLengthIncreaseContext.speed).toEqual(assertSpeed);
              });

        });
    });


  //test('Food is removed from pantry once placed on the board', () => {});

  /* 5. Food is removed from pantry once placed on the board
        GIVEN the pantry has 20 food items,
        WHEN user input is detected
        AND next move collides with food tile
        THEN place new food item on board
        AND remove one food item from pantry
  */

  //describe('Game states (win/lose)', () => {});

  /* 6. Game is won when all the food is eaten
        GIVEN the board renders,
        WHEN user input is detected
        AND next move collides with last food item on board
        AND no food is left in pantry
        THEN the game is won
        AND display the Game Won Screen
  */

  /* 7. Game is lost when sandworm collides with it's own tail 
        GIVEN the board renders,
        WHEN user input is detected
        AND next move collides with sandworm tail
        THEN the game is lost
        AND display the Game Over Screen
  */
});
