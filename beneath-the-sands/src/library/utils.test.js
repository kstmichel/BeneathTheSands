import "@testing-library/jest-dom"; // Ensure this import is present
import { Device, Direction, WormAnatomy } from './definitions';
import { 
    getDeviceType,
    getGridArray, 
    getNextMove, 
    getOppositeDirection, 
    getRandomizedPossibleDirections, 
    getDirectionByWormPath,
    addNewDirectionToWormPath,
    setupWormPath,
    extendWormPath,
    getTileSize,
    getTotalTiles,
} from './utils';

describe('getDeviceType Utility Function', () => {
    const desktopDimensions = {width: 1030, height: 768};
    const tabletDimensions = {width: 1000, height: 1024};
    const mobileDimensions = {width: 655, height: 812};

    it('returns Device.Desktop when window size is larger than Tablet width constraint', () => {
        const deviceType = getDeviceType(desktopDimensions);

        expect(deviceType).toEqual(Device.Desktop);
    });

    it('returns Device.Tablet when window size is larger than Mobile width constraint', () => {
        const deviceType = getDeviceType(tabletDimensions);

        expect(deviceType).toEqual(Device.Tablet);
    });

    it('returns Device.Mobile when window size is less than the Tablet width constraint', () => {
        const deviceType = getDeviceType(mobileDimensions);

        expect(deviceType).toEqual(Device.Mobile);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred while determining device type. Window size was invalid.";

        it('throws error when windowSize is null', () => {
            expect(() => getDeviceType(null)).toThrow(errorMessage);
        });

        it('throws error when windowSize.width is 0', () => {
            expect(() => getDeviceType({width: 0, height: 1000})).toThrow(errorMessage);
        });
    })
    

});
describe('getGridArray Utility Function', () => {
    it('returns a grid array when parameters are not null', () => {
        const assertTotalTiles = 150;
        const gridArray = getGridArray({rows: 15, columns: 10});

        expect(gridArray).toBeDefined();
        expect(gridArray.length * gridArray[0].length).toEqual(assertTotalTiles);
    });

    describe('error handling', () => {
        const errorMessage = 'Invalid grid dimensions or tile size.';

        it('throws an error when rows is zero', () => {
            expect(() => getGridArray({rows: 0, columns: 10})).toThrow(errorMessage);
        });
    
        it('throws an error when columns is zero', () => {
            expect(() => getGridArray({rows: 10, columns: 0})).toThrow(errorMessage);
        });
    
        it('throws an error when rows is null', () => {
            expect(() => getGridArray({rows: null, columns: 10})).toThrow(errorMessage);
        });
    
        it('throws an error when columns is null', () => {
            expect(() => getGridArray({rows: 10, columns: null})).toThrow(errorMessage);
        });
    });
});      

describe('getNextMove Utility Function', () => {
    describe('When parameters are valid return next move coordinates', () => {
        it('returns next move to the North when UP direction is provided', () => {
            const coordinate = {row: 10, column: 13};
            const assertNextMoveCoordinate = {row: 9, column: 13};
            const nextMove = getNextMove(coordinate, Direction.UP);
    
            expect(nextMove.coordinates).toEqual(assertNextMoveCoordinate);
        });

        it('returns next move to the East when RIGHT direction is provided', () => {
            const coordinate = {row: 10, column: 13};
            const assertNextMoveCoordinate = {row: 10, column: 14};
            const nextMove = getNextMove(coordinate, Direction.RIGHT);
    
            expect(nextMove.coordinates).toEqual(assertNextMoveCoordinate);
        });

        it('returns next move to the South when DOWN direction is provided', () => {
            const coordinate = {row: 10, column: 13};
            const assertNextMoveCoordinate = {row: 11, column: 13};
            const nextMove = getNextMove(coordinate, Direction.DOWN);
    
            expect(nextMove.coordinates).toEqual(assertNextMoveCoordinate);
        });

        it('returns next move to the West when LEFT direction is provided', () => {
            const coordinate = {row: 10, column: 13};
            const assertNextMoveCoordinate = {row: 10, column: 12};
            const nextMove = getNextMove(coordinate, Direction.LEFT);
    
            expect(nextMove.coordinates).toEqual(assertNextMoveCoordinate);
        });
    });

    describe('when parameters are invalid', () => {

        it('throws error when coordinate or direction are invalid', () => {
            const coordinate = {row: 3, column: 10};
            const direction = Direction.DOWN;
            const errorMessage = "Cannot get next coordinate because coordinate or direction are invalid.";

            expect(() => getNextMove(null, direction)).toThrow(errorMessage);
            expect(() => getNextMove(coordinate, null)).toThrow(errorMessage);
        });
    });
});

describe('getOppositeDirection Utility Function', () => {
    it('returns UP when direction argument value is DOWN', () => {
        expect(getOppositeDirection(Direction.DOWN)).toEqual(Direction.UP);
    });

    it('returns RIGHT when direction argument value is LEFT', () => {
        expect(getOppositeDirection(Direction.RIGHT)).toEqual(Direction.LEFT);
    });


    it('returns DOWN when direction argument value is UP', () => {
        expect(getOppositeDirection(Direction.DOWN)).toEqual(Direction.UP);
    });

    it('returns LEFT when direction argument value is RIGHT', () => {
        expect(getOppositeDirection(Direction.LEFT)).toEqual(Direction.RIGHT);
    });

    it('throws error when direction argument is invalid', () => {
        expect(() => getOppositeDirection(null)).toThrow('Cannot return opposite direction when direction argument is invalid.');
    });
});

describe('getRandomizedPossibleDirections Utility Function', () => {
    it('returns randomized possible directions', () => {
        const randomizedOptions = getRandomizedPossibleDirections(Direction.UP);

        expect(randomizedOptions.length).toBe(2);
        expect(randomizedOptions).toContain(Direction.LEFT);
        expect(randomizedOptions).toContain(Direction.RIGHT);
    });
   
    it('should throw error when direction is null', () => {    
        expect(() => getRandomizedPossibleDirections(null)).toThrow("Issue occurred while getting possible directions, missing current direction.");
    });
});

describe('getDirectionByWormPath Utility Function', () => {
    describe('gets worm path direction for worm segment when arguments are valid', () => {

        it('references direction from worm path for head segment', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, headSegment)).toEqual(Direction.UP);
        });
    
        it('references direction from worm path for body segment', () => {
            const bodySegment = {
                key: 1,
                part: WormAnatomy.BODY,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, bodySegment)).toEqual(Direction.RIGHT);
        });
    
        it('references direction from worm path for second body segment', () => {
            const bodySegment = {
                key: 2,
                part: WormAnatomy.BODY,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, bodySegment)).toEqual(Direction.LEFT);
        });

        it('references direction from worm path for tail segment', () => {
            const tailSegment = {
                key: 3,
                part: WormAnatomy.TAIL,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, tailSegment)).toEqual(Direction.DOWN);
        });
    });

    describe('error handling when arguments are invalid', () => {
        const errorMessage = 'Error occurred getting direction from worm path. Invalid worm path or segment.';

        it('throws error when worm path is null', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };

            expect(() => getDirectionByWormPath(null, headSegment)).toThrow(errorMessage);
        });

        it('throws error when worm path length is zero', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };

            expect(() => getDirectionByWormPath([], headSegment)).toThrow(errorMessage);
        });

        it('throws error when segment is invalid', () => {
            const wormPath = [Direction.UP, Direction.UP, Direction.UP, Direction.UP];
            expect(() => getDirectionByWormPath(wormPath, null)).toThrow(errorMessage);
        });

        it('throws error when segment key is missing', () => {
            const headSegment = {
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.UP, Direction.UP, Direction.UP];
            expect(() => getDirectionByWormPath(wormPath, headSegment)).toThrow(errorMessage);
        });

    });
});

describe('addNewDirectionToWormPath Utility Function', () => {
    it('adds new direction to worm path when arguments', () => {
        const currentWormPath = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
        const assertWormPath = [Direction.RIGHT, Direction.UP, Direction.RIGHT, Direction.DOWN];
        const updatedWormPath = addNewDirectionToWormPath(Direction.RIGHT, currentWormPath);

        expect(updatedWormPath).toEqual(assertWormPath);
        expect(updatedWormPath.length).toEqual(4);
    });

    it('throws error when direction or worm path is invalid', () => {
        const newDirection = Direction.UP;
        const wormPath = [Direction.RIGHT, Direction.UP, Direction.RIGHT, Direction.DOWN];
        const errorMessage = 'Issue occurred when adding new direction to worm path. Invalid direction or worm path.';

        expect(() => addNewDirectionToWormPath(null, wormPath)).toThrow(errorMessage);
        expect(() => addNewDirectionToWormPath(newDirection, null)).toThrow(errorMessage);
    });
});

describe('setupWormPath Utility Function', () => {
    it('returns a worm path based on starting direction', () => {
        const wormLength = 4;
        const direction = Direction.RIGHT;
        const assertWormPath = [Direction.RIGHT, Direction.RIGHT, Direction.RIGHT, Direction.RIGHT];
        const initialWormPath = setupWormPath(wormLength, direction);
        
        expect(initialWormPath.length).toEqual(wormLength);
        expect(initialWormPath).toEqual(assertWormPath);
        expect(initialWormPath).not.toEqual([Direction.UP, Direction.RIGHT]);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred while setting up worm path. Invalid worm length or worm direction.";

        it('throws error when worm length is invalid', () => {
            expect(() => setupWormPath(null, Direction.UP)).toThrow(errorMessage);
            expect(() => setupWormPath(0, Direction.UP)).toThrow(errorMessage);
        });

        it('throws error when direction is invalid', () => {
            expect(() => setupWormPath(4, null)).toThrow(errorMessage);
        });
    });
});

describe('extendWormPath Utility Function', () => {
    it('returns an updated worm path when arguments are valid', () => {
        const newWormLength = 5;
        const originalWormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];
        const extendedWormPath = extendWormPath(newWormLength, originalWormPath);

        expect(extendedWormPath.length).toEqual(newWormLength);
        expect(extendedWormPath).toEqual([...originalWormPath, Direction.DOWN]);
        expect(extendedWormPath).not.toEqual([...originalWormPath, Direction.LEFT]);
    });

    describe('error handing', () => {
        const errorMessage = "Issued occurred updating worm path. Invalid worm length or worm path.";
        const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];
        const wormLength = 4;

        it('throws error when worm length is null', () => {
            expect(() => extendWormPath(null, wormPath)).toThrow(errorMessage);
        });

        it('throws error when worm length is zero', () => {
            expect(() => extendWormPath(null, wormPath)).toThrow(errorMessage);
        });

        it('throws error when worm path is null', () => {
            expect(() => extendWormPath(wormLength, null)).toThrow(errorMessage);
        });

        it('throws error when worm path length is zero', () => {
            expect(() => extendWormPath(wormLength, 0)).toThrow(errorMessage);
        });
    });
});

describe('getTileSize Utility Function', () => {
    it('returns tile size based on window dimension and device', () => {
        expect(getTileSize({innerWidth: 1400, innerHeight: 900}, Device.Desktop)).toEqual(42);
        expect(getTileSize({innerWidth: 800, innerHeight: 900}, Device.Tablet)).toEqual(36);
        expect(getTileSize({innerWidth: 600, innerHeight: 700}, Device.Mobile)).toEqual(36);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred during tile size calculation. Invalid window or device.";
        it('throws an error when window is null', () => {
            expect(() => getTileSize(null, Device.Mobile)).toThrow(errorMessage);
        });

        it('throws an error when device type is null', () => {
            expect(() => getTileSize({ innerWidth: 300, innerHeight: 900 }, null)).toThrow(errorMessage);
        });
    })
});

describe('getTotalTiles Utility Function', () => {
    it('calculates total number of tiles from board size', () => {
        expect(getTotalTiles({rows: 10, columns: 10})).toEqual(100);
        expect(getTotalTiles({rows: 10, columns: 15})).toEqual(150);
    })

    it('throws error when dimensions argument is missing', () => {
        expect(() => getTotalTiles(null)).toThrow('Cannot calculate total tiles. Missing dimensions.');
    });
});
