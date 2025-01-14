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

const baseWormLocation = [
  { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
  { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
  { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
  { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
];

const baseSandwormData = {
  startDirection: Direction.RIGHT,
  segments: baseWormLocation
}

const baseFoodData = [
  { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
  { key: 1, variant: 'soulFood', location: {row: 5, column: 5 }},
  { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
  { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
];

const baseGameData = {
  sandWorm: baseSandwormData,
  food: baseFoodData
}

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

// Rendering
describe("Gameboard Rendering", () => {
  describe("Displays correct number of tiles", () => {
    test("Desktop screen size", async () => {
      act(() => {
        resizeWindow(desktopDimensions);
      });

      const appData = {
        data: {
          game: baseGameData,
          context: baseContextData
        }
      };

      render(
        <MockGameProvider data={appData.context} value={baseContext}>
          <App {...appData} />
        </MockGameProvider>      
      );

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

      const appData = {
        data: {
          game: baseGameData,
          context: baseContextData
        }
      };

      render(
        <MockGameProvider data={appData.context} value={baseContext}>
          <App {...appData} />
        </MockGameProvider>      
      );
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

      const appData = {
        data: {
          game: baseGameData,
          context: baseContextData
        }
      };

      render(
        <MockGameProvider data={appData.context} value={baseContext}>
          <App {...appData} />
        </MockGameProvider>      
      );

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

        const renderInitialWormData = {
          data: {
            game: {
              ...baseGameData,
              sandWorm: {
                startDirection: Direction.RIGHT,
                segments: [
                  { key: 0, part: WormAnatomy.HEAD, location: { row: 6, column: 10 } },
                  { key: 1, part: WormAnatomy.BODY, location: { row: 6, column: 9 } },
                  { key: 2, part: WormAnatomy.BODY, location: { row: 6, column: 8 } },
                  { key: 3, part: WormAnatomy.TAIL, location: { row: 6, column: 7 } },
                ]
              }
            },
            context: baseContextData
          }
        };

        const {sandWorm} = renderInitialWormData.data.game;

        render(
          <MockGameProvider data={renderInitialWormData.context} value={baseContext}>
            <App {...renderInitialWormData} />
          </MockGameProvider>      
        );

        await waitFor(() => {
          sandWorm.segments.forEach((segment) => {
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

        const renderInitialFoodData = {
          data: {
            game: {
              ...baseGameData,
              food: [
                { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
                { key: 1, variant: 'soulFood', location: {row: 5, column: 7 }},
                { key: 1, variant: 'soulFood', location: {row: 8, column: 1 }},
                { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
              ],
            },
            context: baseContextData
          }
        };

        const { food } = renderInitialFoodData.data.game;

        render(
          <MockGameProvider data={renderInitialFoodData.context} value={baseContext}>
            <App {...renderInitialFoodData} />
          </MockGameProvider>      
        );

        await waitFor(() => {
          food.forEach((item) => {
            const { row, column } = item.location;

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

      it("continues to move in current direction", async () => {
        /*  GIVEN the board renders, 
            WHEN no input is detected, 
            THEN the sandworm should continue to move in current direction 
            AND sandworm maintains a solid line.  */

        // NOTE: This test assumes sandworm is moving to the right

        act(() => {
          resizeWindow(desktopDimensions);
        });

        const continueDirectionData = {
          data: {
            game: {
              ...baseGameData,
              sandWorm: {
                startDirection: Direction.RIGHT,
                segments: [
                  { key: 0, part: WormAnatomy.HEAD, location: { row: 8, column: 10 } },
                  { key: 1, part: WormAnatomy.BODY, location: { row: 8, column: 9 } },
                  { key: 2, part: WormAnatomy.BODY, location: { row: 8, column: 8 } },
                  { key: 3, part: WormAnatomy.TAIL, location: { row: 8, column: 7 } },
                ]
              }
            },
            context: baseContextData
          }
        };

        const {sandWorm} = continueDirectionData.data.game;

        render(
          <MockGameProvider data={continueDirectionData.context} value={baseContext}>
            <App {...continueDirectionData} />
          </MockGameProvider>      
        );

        // wait for sandworm to render
        await waitFor(() => {
          sandWorm.segments.forEach((segment) => {
            const { row, column } = segment.location;
            const tile = screen.getByTestId(`tile-${row}-${column}`);
            expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
          });
        });

        // wait one sandworm move
        act(() => {
          jest.advanceTimersByTime(baseContext.speed);
        });

        await waitFor(
          () => {
            const assertMoveCoordinates = [
              { row: 8, column: 11 },
              { row: 8, column: 10 },
              { row: 8, column: 9 },
              { row: 8, column: 8 },
            ]
            sandWorm.segments.forEach((segment, index) => {
              const {row, column} = assertMoveCoordinates[index];
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          }, { timeout: 500 });
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
            game: baseGameData,
            context: baseContextData
          }
        };

        // move sandworm location to right before right boundary
        let sandwormApproachingBoundary = boundaryTestData.data.game.sandWorm.segments.map(
          (segment) => {
            let updatedSegment = { ...segment };
            updatedSegment.location.column = maxColumn - 1; 
            maxColumn -= 1;

            return updatedSegment;
          }
        );

        const updatedGameData = {
          ...boundaryTestData.data.game,
          sandworm: {
            ...boundaryTestData.data.game.sandWorm,
            location: sandwormApproachingBoundary
          } 
        }

        const testWormHitBoundaryData = {
          data: {
            ...boundaryTestData.data,
            game: updatedGameData
          }
        };

        const {sandWorm} = testWormHitBoundaryData.data.game;
        let testHeadCoordinates = sandwormApproachingBoundary[0].location; // initialize test coordinates

        render(
          <MockGameProvider data={boundaryTestData.context} value={baseContext}>
            <App {...boundaryTestData} />
          </MockGameProvider>      
        );

        // wait for sandworm to render
        await waitFor(() => {
          sandWorm.segments.forEach((segment) => {
            const { row, column } = segment.location;
            const tile = screen.getByTestId(`tile-${row}-${column}`);
            expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
          });
        });

        // wait one sandworm move
        act(() => {
          jest.advanceTimersByTime(baseContext.speed);
        });

        // determine which way the sandworm went (up or down)
        const headRow = sandWorm.segments[0].row;
        const testTileUp = 6;
        const testTileDown = 8;

        if (headRow > testHeadCoordinates.row) {
          testHeadCoordinates = { ...testHeadCoordinates, row: testTileDown };
        } else if (headRow < testHeadCoordinates.row) {
          testHeadCoordinates = { ...testHeadCoordinates, row: testTileUp };
        }

        await waitFor(() => {
          // check that sandworm moved accurately based on direction
          sandWorm.segments.forEach((segment) => {
            let assertCoordinates = {...segment.location};

            if (segment.part === "head") {
              assertCoordinates = testHeadCoordinates;
            }

            const tile = screen.getByTestId(`tile-${assertCoordinates.row}-${assertCoordinates.column}`);
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
              game: {
                ...baseGameData,
                sandWorm: {
                  startDirection: Direction.RIGHT,
                  segments: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 6, column: 10 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 6, column: 9 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 6, column: 8 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 6, column: 7 } },
                  ]
                }
              },
              context: baseContextData
            }
          };
  
          const {sandWorm} = boundaryTestData.data.game;
  
          render(
            <MockGameProvider data={boundaryTestData.context} value={baseContext}>
              <App {...boundaryTestData} />
            </MockGameProvider>      
          );
  
          // wait for sandworm to render
          await waitFor(() => {
            sandWorm.segments.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });

          await waitFor(() => {
            const assertSandwormLocation = [
              { row: 5, column: 10 },
              { row: 6, column: 10 },
              { row: 6, column: 9 },
              { row: 6, column: 8 },
            ];
  
            sandWorm.segments.forEach((segment, index) => {
              const {row, column} = assertSandwormLocation[index];
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            })
          });
        });

        it("moves right when RIGHT arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopDimensions);
          });

          const gameTestDataMoveRight = {
            data: {
              game: {
                ...baseGameData,
                sandWorm: {
                  startDirection: Direction.UP,
                  segments: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 4, column: 6 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 5, column: 6 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 6, column: 6 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 6 } },
                  ]
                }
              },
              context: baseContextData
            }
          };

        const {sandWorm} = gameTestDataMoveRight.data.game;

        render(
          <MockGameProvider data={gameTestDataMoveRight.context} value={baseContext}>
            <App {...gameTestDataMoveRight} />
          </MockGameProvider>      
        );
        
          // wait for sandworm to render
          await waitFor(() => {
            sandWorm.segments.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });
          
          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 4, column: 7 },
              { row: 4, column: 6 },
              { row: 5, column: 6 },
              { row: 6, column: 6 }
            ];

            sandWorm.segments.forEach((segment, index) => {
              const {row, column} = testSegmentValidLocation[index];
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            })
          });
        });

        it("moves down when DOWN arrow key is pressed", async () => {
            act(() => {
              resizeWindow(desktopDimensions);
            });

            const gameTestDataMoveDown = {
              data: {
                game: {
                  ...baseGameData,
                  sandWorm: {
                    startDirection: Direction.RIGHT,
                    segments: [
                      { key: 0, part: WormAnatomy.HEAD, location: { row: 6, column: 10 } },
                      { key: 1, part: WormAnatomy.BODY, location: { row: 6, column: 9 } },
                      { key: 2, part: WormAnatomy.BODY, location: { row: 6, column: 8 } },
                      { key: 3, part: WormAnatomy.TAIL, location: { row: 6, column: 7 } },
                    ]
                  }
                },
                context: baseContextData
              }
            };
    
            const {sandWorm} = gameTestDataMoveDown.data.game;
    
            render(
              <MockGameProvider data={gameTestDataMoveDown.context} value={baseContext}>
                <App {...gameTestDataMoveDown} />
              </MockGameProvider>      
            );

            // wait for sandworm to render
            await waitFor(() => {
              sandWorm.segments.forEach((segment) => {
                const { row, column } = segment.location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
              });
            });

            // press up arrow key
            fireEvent.keyDown(window, { key: "ArrowDown", code: "ArrowDown" });

            await waitFor(() => {
              const testSegmentValidLocation = [
                { row: 7, column: 10 },
                { row: 6, column: 10 },
                { row: 6, column: 9 },
                { row: 6, column: 8 }
              ];

              sandWorm.segments.forEach((segment, index) => {
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
              game: {
                ...baseGameData,
                sandWorm: {
                  startDirection: Direction.UP,
                  segments: [
                    { key: 0, part: WormAnatomy.HEAD, location: { row: 5, column: 9 } },
                    { key: 1, part: WormAnatomy.BODY, location: { row: 6, column: 9 } },
                    { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                    { key: 3, part: WormAnatomy.TAIL, location: { row: 8, column: 9 } },
                  ]
                },
              },
              context: baseContextData
            }
          };

        const {sandWorm} = leftArrowTestData.data.game;

        render(
          <MockGameProvider data={leftArrowTestData.context} value={baseContext}>
            <App {...leftArrowTestData} />
          </MockGameProvider>      
        );

          // wait for sandworm to render
          await waitFor(() => {
            sandWorm.segments.forEach((segment) => {
              const { row, column } = segment.location;
              const tile = screen.getByTestId(`tile-${row}-${column}`);
              expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });

          // press up arrow key
          fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
          
          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 5, column: 8 },
              { row: 5, column: 9 },
              { row: 6, column: 9 },
              { row: 7, column: 9 }
            ];

            sandWorm.segments.forEach((segment, index) => {
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

                const reverseDirectionData = {
                  data: {
                    game: {
                      ...baseGameData,
                      sandWorm: {
                        startDirection: Direction.RIGHT,
                        segments: [
                          { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                          { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                          { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                          { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                        ]
                      },
                    },
                    context: baseContextData
                  }
                };

                const {sandWorm} = reverseDirectionData.data.game;
                const assertNotReversed = {row: 7, column: 5}
        
                render(
                  <MockGameProvider data={reverseDirectionData.context} value={baseContext}>
                    <App {...reverseDirectionData} />
                  </MockGameProvider>      
                );
        
                // wait for sandworm to render
                await waitFor(() => {
                  sandWorm.segments.forEach((segment) => {
                    const { row, column } = segment.location;
                    const tile = screen.getByTestId(`tile-${row}-${column}`);
                    expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                  });
                });
        
                fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
        
                act(() => {
                  jest.advanceTimersByTime(baseContext.speed);
                });

                 // ASSERT (invalid) The sandworm head did not turn left on top of it's own body
                 await waitFor(() => {
                  const {row, column} = assertNotReversed;
                  const headTile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(headTile).not.toHaveClass("tile-texture--head");
                });

                // ASSERT (valid) The sandworm head continued in the direction it was going
                await waitFor(() => {
                  const assertSegmentCoordinates = [
                    { row: 7, column: 6 },
                    { row: 7, column: 5 },
                    { row: 7, column: 4 },
                    { row: 7, column: 3 }
                  ];
                  
                  sandWorm.segments.forEach((segment, index) => {
                      const {row, column} = assertSegmentCoordinates[index];
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
                    game: {
                      ...baseGameData,
                      sandWorm: {
                        startDirection: Direction.RIGHT,
                        segments: [
                          { key: 0, part: WormAnatomy.HEAD, location: { row: 14, column: 10 } },
                          { key: 2, part: WormAnatomy.BODY, location: { row: 14, column: 8 } },
                          { key: 1, part: WormAnatomy.BODY, location: { row: 14, column: 9 } },
                          { key: 3, part: WormAnatomy.TAIL, location: { row: 14, column: 7 } },
                        ]
                      },
                    },
                    context: baseContextData
                  }
                };

                const {sandWorm} = collideWithWallTest.data.game;
        
                render(
                  <MockGameProvider data={collideWithWallTest.context} value={baseContext}>
                    <App {...collideWithWallTest} />
                  </MockGameProvider>      
                );
          
                  // wait for sandworm to render
                  await waitFor(() => {
                    sandWorm.segments.forEach((segment) => {
                      const { row, column } = segment.location;
                      const tile = screen.getByTestId(`tile-${row}-${column}`);
                      expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                    });
                  });
          
                  // ACT: press down arrow key into bottom wall boundary
                  fireEvent.keyDown(window, { key: "ArrowDown", code: "ArrowDown" });
  
                  // ASSERT (valid behavior): The sandworm head continued in the direction it was going
                  await waitFor(() => {
                    const assertSegmentLocations = [
                      { row: 14, column: 11 },
                      { row: 14, column: 10 },
                      { row: 14, column: 9 },
                      { row: 14, column: 8 }
                    ];

                    sandWorm.segments.forEach((segment, index) => {
                        const {row, column} = assertSegmentLocations[index];
                        const tile = screen.getByTestId(`tile-${row}-${column}`);
  
                        expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                    });
                  });
          });
      });
    });

    describe('Food Interaction Effects (Context Tests)', () => {

      describe('Sandworm eats a food item', () => {
        
        it('increases the sandworm length', async () => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND increases body length by 1  */

              act(() => {
                resizeWindow(desktopDimensions);
              });

              let contextLengthIncrease = {
                  wormLength: 4,
                  speed: 300,
                  dropInventory: { food: 10 },
                  maxActiveDrops: 5,
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
                contextLengthIncrease.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();
              }
          
              const increaseWormLength = () => contextLengthIncrease.wormLength += 1;
              const increaseScore = () => contextLengthIncrease.score += 100;
              const increaseSpeed = () => contextLengthIncrease.speed -= 50;

              const growInLengthTestData = {
                data: {
                  game: {
                    sandWorm: {
                      startDirection: Direction.RIGHT,
                      segments: [
                        { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                        { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                        { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                        { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                      ]
                    },
                    food: [
                      { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                      { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                      { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                      { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                    ]
                  },
                  context: baseContextData
                }
              };
    
            const {sandWorm, food} = growInLengthTestData.data.game;
    
            render(
              <MockGameProvider data={growInLengthTestData.context} value={contextLengthIncrease}>
                <App {...growInLengthTestData} />
              </MockGameProvider>      
            );

              // wait for sandworm to render
              await waitFor(() => {
                sandWorm.segments.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(contextLengthIncrease.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                contextLengthIncrease.increaseFoodEaten();
              })

              const assertWormLength = 5; 

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {                
                expect(contextLengthIncrease.wormLength).toEqual(assertWormLength);
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

        it('increases the score', async() => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND the score increases by 100 */

              act(() => {
                resizeWindow(desktopDimensions);
              });

              let contextIncreaseScore = {
                wormLength: 4,
                speed: 300,
                maxActiveDrops: 5,
                dropInventory: {food: 10},
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
                contextIncreaseScore.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();
              }
          
              const increaseWormLength = () => contextIncreaseScore.wormLength += 1;
              const increaseScore = () => contextIncreaseScore.score += 100;
              const increaseSpeed = () => contextIncreaseScore.speed -= 50;

              const increaseScoreTestData = {
                data: {
                  game: {
                    sandWorm: {
                      startDirection: Direction.RIGHT,
                      segments: [
                        { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                        { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                        { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                        { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                      ]
                    },
                    food: [
                      { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                      { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                      { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                      { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                    ]
                  },
                  context: baseContextData
                }
              };
    
            const {sandWorm, food} = increaseScoreTestData.data.game;
    
            render(
              <MockGameProvider data={increaseScoreTestData.context} value={contextIncreaseScore}>
                <App {...increaseScoreTestData} />
              </MockGameProvider>
            );      

              // wait for sandworm to render
              await waitFor(() => {
                sandWorm.segments.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);

                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(contextIncreaseScore.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                contextIncreaseScore.increaseFoodEaten();
              })

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {
                const assertScore = 100; 
                expect(contextIncreaseScore.score).toEqual(assertScore);
              });
        });

        it('increases the game speed', async() => {
          /*  GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND the speed increases by 50ms */

              act(() => {
                resizeWindow(desktopDimensions);
              });


              let contextSpeedIncrease = {
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
                contextSpeedIncrease.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();
              }
          
              const increaseWormLength = () => contextSpeedIncrease.wormLength += 1;
              const increaseScore = () => contextSpeedIncrease.score += 100;
              const increaseSpeed = () => contextSpeedIncrease.speed -= 50;

              const increaseSpeedTestData = {
                data: {
                  game: {
                    sandWorm: {
                      startDirection: Direction.RIGHT,
                      segments: [
                        { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                        { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                        { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                        { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                      ]
                    },
                    food: [
                      { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
                      { key: 1, variant: 'soulFood', location: {row: 10, column: 10 }},
                      { key: 1, variant: 'soulFood', location: {row: 12, column: 12 }},
                      { key: 1, variant: 'soulFood', location: {row: 14, column: 14 }}
                    ]
                  },
                  context: baseContextData
                }
              };
              
              const {sandWorm, food} = increaseSpeedTestData.data.game;

              render(
                <MockGameProvider data={increaseSpeedTestData.context} value={contextSpeedIncrease}>
                  <App {...increaseSpeedTestData} />
                </MockGameProvider>
              );

              // wait for sandworm to render
              await waitFor(() => {
                sandWorm.segments.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(
                    `tile-texture--${segment.part.toLowerCase()}`
                  );
                });
              });

              // wait one sandworm move
              act(() => {
                jest.advanceTimersByTime(baseContext.speed);
              });

              //assert that head tile exists on a food coordinate
              await waitFor(() => {
                const {row, column} = food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                contextSpeedIncrease.increaseFoodEaten();
              })

              //assert game context is updated to increase body by 1 tile
              await waitFor(() => {
                const assertSpeed = 250; 
                expect(contextSpeedIncrease.speed).toEqual(assertSpeed);
              });
        });

        it('removes food item from drop inventory', async() => {
           /* GIVEN the board renders,
              AND next move collides with food tile
              AND we wait for one move
              THEN the sandworm eats the food item
              AND the speed increases by 50ms */

              act(() => {
                resizeWindow(desktopDimensions);
              });


              let contextRemoveFood = {
                wormLength: 4,
                speed: 300,
                foodEaten: 0,
                maxActiveDrops: 5,
                dropInventory: {food: 10},
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
                contextRemoveFood.foodEaten += 1;
            
                increaseWormLength();
                increaseScore();
                increaseSpeed();

                if(contextRemoveFood.dropInventory.food > 0){
                  removeDropFromInventory();
                }             
             }
          
              const increaseWormLength = () => contextRemoveFood.wormLength += 1;
              const increaseScore = () => contextRemoveFood.score += 100;
              const increaseSpeed = () => contextRemoveFood.speed -= 50;
              const removeDropFromInventory = () => contextRemoveFood.dropInventory.food -= 1;

              const removeFoodData = {
                data: {
                  game: {
                    sandWorm: {
                      startDirection: Direction.RIGHT,
                      segments: [
                        { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 6 } },
                        { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 5 } },
                        { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 4 } },
                        { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 3 } },
                      ]
                    },
                    food: [
                      { variant: 'soulFood', location: {row: 7, column: 7 }},
                      { variant: 'soulFood', location: {row: 10, column: 10 }},
                      { variant: 'soulFood', location: {row: 12, column: 12 }},
                      { variant: 'soulFood', location: {row: 14, column: 14 }},
                      { variant: 'soulFood', location: {row: 14, column: 17 }}
                    ]
                  },
                  context: baseContextData
                }
              };

              const {sandWorm, food} = removeFoodData.data.game;

              render(
                <MockGameProvider data={removeFoodData.context} value={contextRemoveFood}>
                  <App {...removeFoodData} />
                </MockGameProvider>      
              );

              await waitFor(() => {
                sandWorm.segments.forEach((segment) => {
                  const { row, column } = segment.location;
                  const tile = screen.getByTestId(`tile-${row}-${column}`);
                  expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
                });
              });

              act(() => {
                jest.advanceTimersByTime(contextRemoveFood.speed);
              });

              //assert snake ate food
              await waitFor(() => {
                const {row, column} = food[0].location;
                const tile = screen.getByTestId(`tile-${row}-${column}`);
                expect(tile).toHaveClass('tile-texture--head');
              });

              act(() => {
                contextRemoveFood.increaseFoodEaten();
              })

              await waitFor(() => {
                const assertDropFoodTotalReduced = 9;
                expect(contextRemoveFood.dropInventory.food).toStrictEqual(assertDropFoodTotalReduced);
              });

              await waitFor(() => {
                const assertTotalRenderedFoodTiles = 4;
                const foodTiles = screen.getAllByTestId(`tile-type-food`);
                expect(foodTiles.length).toStrictEqual(assertTotalRenderedFoodTiles);
              });
        });
      });
    });


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
