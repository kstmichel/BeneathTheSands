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
import { getTotalTiles } from "../../library/utils";
import {
  GameDimensions,
  Direction,
  WormAnatomy,
} from "../../library/definitions";
import { MockGameProvider } from "../../GameContext";
import "@testing-library/jest-dom"; // Ensure this import is present

/*
  AREAS TO TEST:
    Rendering the grid
    Handling user input
    Updating the game state
    Responding to different screen sizes
*/

// Device Screen Sizes
const desktopWidth = 1030;
const desktopHeight = 768;

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
  { row: 3, column: 3 },
  { row: 5, column: 7 },
  { row: 8, column: 1 },
  { row: 9, column: 9 },
];

const testWormData = {
  data: {
    sandWorm: sandWormTestLocation,
    food: foodTestLocations,
    startDirection: Direction.RIGHT,
  },
};

function resizeWindow(width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
}

jest.useFakeTimers();

afterEach(() => {
  cleanup();
});

// Rendering
describe("Gameboard renders correctly", () => {
  describe("Renders correctly at different screen sizes", () => {
    test("Desktop screen size", async () => {
      act(() => {
        resizeWindow(desktopWidth, desktopHeight);
      });

      render(
        <MockGameProvider value={testContext}>
          <App {...testWormData} />
        </MockGameProvider>
      );

      await waitFor(() => {
        const tiles = screen.getAllByTitle("grid-tile");
        const totalTiles = getTotalTiles("desktop");

        expect(tiles.length).toBe(totalTiles);
      });
    });

    test("Tablet screen size", async () => {
      act(() => {
        resizeWindow(1000, 1024);
      });

      render(
        <MockGameProvider value={testContext}>
          <App {...testWormData} />
        </MockGameProvider>
      );

      await waitFor(() => {
        const tabletTiles = screen.getAllByTitle("grid-tile");
        const totalTiles = getTotalTiles("tablet");

        expect(tabletTiles.length).toBe(totalTiles);
      });
    });

    test("Mobile screen size", async () => {
      act(() => {
        resizeWindow(375, 812);
      });

      render(
        <MockGameProvider value={testContext}>
          <App {...testWormData} />
        </MockGameProvider>
      );

      await waitFor(() => {
        const tiles = screen.getAllByTitle("grid-tile");
        const totalTiles = getTotalTiles("mobile");
        expect(tiles.length).toBe(totalTiles);
      });
    });
  });

  describe("Renders board elements correctly", () => {
    test("Renders initial Sandworm location", async () => {
      render(
        <MockGameProvider value={testContext}>
          <App {...testWormData} />
        </MockGameProvider>
      );
      await waitFor(() => {
        sandWormTestLocation.forEach((segment) => {
          const { row, column } = segment.location;
          const tile = screen.getByTestId(`tile-${row}-${column}`);
          expect(tile).toHaveClass(
            `tile-texture--${segment.part.toLowerCase()}`
          );
        });
      });
    });

    test("Renders initial food locations", async () => {
      render(<App {...testWormData} />);

      await waitFor(() => {
        foodTestLocations.forEach((food) => {
          const { row, column } = food;

          const tile = screen.getByTestId(`tile-${row}-${column}`);
          expect(tile).toHaveClass(`tile-texture--food`);
        });
      });
    });
  });

  describe("Sandworm Behavior", () => {
    describe("Default (No Input)", () => {
      // Default Behavior Tests

      // TODO: add initial worm direction to the game context and use in this test
      test("Sandworm continues to move in current direction", async () => {
        /*  GIVEN the board renders, 
            WHEN no input is detected, 
            THEN the sandworm should continue to move in current direction 
            AND sandworm maintains a solid line.  */

        // NOTE: This test assumes sandworm is moving to the right

        act(() => {
          resizeWindow(desktopWidth, desktopHeight);
        });

        render(
          <MockGameProvider value={testContext}>
            <App {...testWormData} />
          </MockGameProvider>
        );

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

      test("Sandworm changes direction when it hits a boundary", async () => {
        /*  GIVEN the board renders,
            WHEN the sandworm hits wall 
            THEN direction options are validated
            AND sandworm moves in a random direction
        */

        act(() => {
          resizeWindow(desktopWidth, desktopHeight);
        });

        // Setup Sandworm initial location to right before boundary wall (right)
        let maxColumn = GameDimensions["desktop"].columns;

        const boundaryTestData = {
          data: {
            sandWorm: [
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
            ],
            food: foodTestLocations,
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

        render(
          <MockGameProvider value={testContext}>
            <App {...testWormHitBoundaryData} />
          </MockGameProvider>
        );

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

        //NOTE: This test is defaulted to the sandworm moving right into the right boundary,
        //      so the only directions it can move is up or down (for now).
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
      describe(`Apply user input when valid, changing the sandworm direction`, () => {
        test("Sandworm moves up when UP arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopWidth, desktopHeight);
          });

          const boundaryTestData = {
            data: {
              sandWorm: [
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
              ],
              food: foodTestLocations,
              startDirection: Direction.RIGHT,
            },
          };

          render(
            <MockGameProvider value={testContext}>
              <App {...boundaryTestData} />
            </MockGameProvider>
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

        test("Sandworm moves right when RIGHT arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopWidth, desktopHeight);
          });

          const boundaryTestData = {
            data: {
              sandWorm: [
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
              ],
              food: foodTestLocations,
              startDirection: Direction.RIGHT,
            },
          };

          render(
            <MockGameProvider value={testContext}>
              <App {...boundaryTestData} />
            </MockGameProvider>
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

            boundaryTestData.data.sandWorm.forEach((segment, index) => {
                const {row, column} = testSegmentValidLocation[index];
                const tile = screen.getByTestId(`tile-${row}-${column}`);

                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });
        });

        test("Sandworm moves down when DOWN arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopWidth, desktopHeight);
          });

          const boundaryTestData = {
            data: {
              sandWorm: [
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
              ],
              food: foodTestLocations,
              startDirection: Direction.RIGHT,
            },
          };

          render(
            <MockGameProvider value={testContext}>
              <App {...boundaryTestData} />
            </MockGameProvider>
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
            jest.advanceTimersByTime(testContext.speed * 2);
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

        test("Sandworm moves left when LEFT arrow key is pressed", async () => {
          act(() => {
            resizeWindow(desktopWidth, desktopHeight);
          });

          const leftArrowTestData = {
            data: {
              sandWorm: [
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
              ],
              food: foodTestLocations,
              startDirection: Direction.DOWN,
            },
          };

          render(
            <MockGameProvider value={testContext}>
              <App {...leftArrowTestData} />
            </MockGameProvider>
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
            jest.advanceTimersByTime(testContext.speed * 2);
          });
          
          await waitFor(() => {
            const testSegmentValidLocation = [
              { row: 8, column: 9 },
              { row: 8, column: 10 },
              { row: 7, column: 10 },
              { row: 7, column: 9 }
            ];

            leftArrowTestData.data.sandWorm.forEach((segment, index) => {
                const {row, column} = testSegmentValidLocation[index];
                const tile = screen.getByTestId(`tile-${row}-${column}`);

                expect(tile).toHaveClass(`tile-texture--${segment.part.toLowerCase()}`);
            });
          });
        });
      });

      describe('Ignore user input when invalid, continue in current direction', () => {
          test("Sandworm is directed to move in opposite direction (invalid move)", async () => {

              /* GIVEN the board renders,
                 WHEN user input is detected
                 AND next move is invalid as it is in the opposite direction
                 THEN continue moving sandworm in current direction  */

                act(() => {
                  resizeWindow(desktopWidth, desktopHeight);
                });

                const oppositeDirectionTest = {
                  data: {
                    sandWorm: [
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
                    ],
                    food: foodTestLocations,
                    startDirection: Direction.RIGHT,
                  },
                };
        
                render(
                  <MockGameProvider value={testContext}>
                    <App {...oppositeDirectionTest} />
                  </MockGameProvider>
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

          test('Sandworm is directed into a wall', async () => {
              /*  GIVEN the board renders,
                  WHEN user input is detected
                  AND next move is invalid as it collides with boundary
                  THEN continue moving sandworm in current direction  */

                  act(() => {
                    resizeWindow(desktopWidth, desktopHeight);
                  });
  
                  const collideWithWallTest = {
                    data: {
                      sandWorm: [
                        {
                          key: 0,
                          part: WormAnatomy.HEAD,
                          location: { row: 14, column: 10 },
                        },
                        {
                          key: 1,
                          part: WormAnatomy.BODY,
                          location: { row: 14, column: 9 },
                        },
                        {
                          key: 2,
                          part: WormAnatomy.BODY,
                          location: { row: 14, column: 8 },
                        },
                        {
                          key: 3,
                          part: WormAnatomy.TAIL,
                          location: { row: 14, column: 7 },
                        },
                      ],
                      food: foodTestLocations,
                      startDirection: Direction.RIGHT,
                    },
                  };

                  //ASSIGN
                  render(
                    <MockGameProvider value={testContext}>
                      <App {...collideWithWallTest} />
                    </MockGameProvider>
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
  });

  //describe('Context updates based on actions', () => {});

  /* 4. Sandworm grows in length when it eats a food item
        GIVEN the board renders,
        WHEN user input is detected
        AND next move collides with food tile
        THEN the sandworm increases by one tile length
        AND the score increases
        AND the speed increases
  */

  //describe('State updates based on actions', () => {});

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
