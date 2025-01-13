import "@testing-library/jest-dom"; // Ensure this import is present
import { Direction, WormAnatomy } from './definitions';
import { getGridArray } from "./gameGrid";
import { 
    validateNextMove,
    isBoundaryCollisionDetected,
    isReversingDirection,
    filterValidPossibleMoves
} from './validation';

describe('validateNextMove Validation Function', () => {
    it('returns true when NextMove is valid', () => {
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 10, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        expect(validateNextMove(nextMove, gameField)).toBeTruthy();
    });

    it('returns false when NextMove is invalid', () => {
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 40, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        expect(validateNextMove(nextMove, gameField)).toBeFalsy();
    });

    describe('error handling', () => {
        const errorMessage = 'Issue occurred when validating direction. Invalid coordinates, direction, or game dimension.';
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 40, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        it('throws an error when next move is invalid', () => {
            expect(() => validateNextMove(null, gameField)).toThrow(errorMessage);
        });

        it('throws an error when coordinates is invalid', () => {
            expect(() => validateNextMove({direction: Direction.UP, coordinates: null}, gameField)).toThrow(errorMessage);
        });
    
        it('throws an error when game field is invalid', () => {
            expect(() => validateNextMove(nextMove, null)).toThrow(errorMessage);
        });

        it('throws an error when tile grid is invalid', () => {
            expect(() => validateNextMove(nextMove, {tileGrid: null, boardSize: gameDimensions})).toThrow(errorMessage);
        });
    });
});     

describe('isBoundaryCollisionDetected Validation Function', () => {
    it('returns false when coordinate is within game board size', () => {
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 10, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        expect(isBoundaryCollisionDetected(nextMove, gameField)).toBeFalsy();
    })

    it('returns true when coordinate is outside game board size', () => {
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 50, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        expect(isBoundaryCollisionDetected(nextMove, gameField)).toBeTruthy();
    })

    describe('error handling', () => {
        const errorMessage = "Issue occurred while checking for boundary collision. Invalid next move or game field.";
        const gameDimensions = {rows: 15, columns: 30};
        const gameGrid = getGridArray(gameDimensions);
        const nextMove = {
            direction: Direction.UP,
            coordinates: {row: 50, column: 15},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        it('throws error when next move argument is missing', () => {
            expect(() => isBoundaryCollisionDetected(null, gameField)).toThrow(errorMessage);
        });

        it('throws error when coordinate argument is missing', () => {
            expect(() => isBoundaryCollisionDetected({ direction: Direction.UP, coordinates: null}, gameField)).toThrow(errorMessage);
        });

        it('throws error when game field argument is missing', () => {
            expect(() => isBoundaryCollisionDetected(nextMove, null)).toThrow(errorMessage);
        });

        it('throws error when board size argument is missing', () => {
            expect(() => isBoundaryCollisionDetected(nextMove, {tileGrid: gameGrid, boardSize: null})).toThrow(errorMessage);
        });
    });
})

describe('isReversingDirection Validation Function', () => {
    it('returns true if sandworm is reversing direction', () => {
        const sandWorm = [
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
        ];
        const gameDimensions = {rows: 15, columns: 30};
        let gameGrid = getGridArray(gameDimensions);

        sandWorm.forEach((segment) => {
            const {row, column} = segment.location;
            const originalTile = {...gameGrid[row][column]};
            gameGrid[row][column] = {...originalTile, type: segment.part, data: segment};
        });

        const nextMove = {
            direction: Direction.LEFT,
            coordinates: {row: 14, column: 9},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        const {row, column} = nextMove.coordinates;
        const nextTile = gameField.tileGrid[row][column];

        expect(isReversingDirection(nextTile)).toBeTruthy();
    })

    it('returns false if sandworm is not reversing direction', () => {
        const sandWorm = [
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
        ];
        const gameDimensions = {rows: 15, columns: 30};
        let gameGrid = getGridArray(gameDimensions);

        sandWorm.forEach((segment) => {
            const {row, column} = segment.location;
            const originalTile = {...gameGrid[row][column]};
            gameGrid[row][column] = {...originalTile, type: segment.part, data: segment};
        });

        const nextMove = {
            direction: Direction.LEFT,
            coordinates: {row: 14, column: 11},
        };
        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        const {row, column} = nextMove.coordinates;
        const nextTile = gameField.tileGrid[row][column];

        expect(isReversingDirection(nextTile)).toBeFalsy();
    })

    describe('error handling', () => {
        it('throws error when next move is missing', () => {
            const errorMessage = 'Issue occurred while determining if sandworm is reversing direction. Invalid tile argument.';

            expect(() => isReversingDirection(null)).toThrow(errorMessage);
        });
    });
});

describe('filterValidPossibleMoves Validation Function', () => {
    it('returns both options when both are valid', () => {
        const sandWorm = [
            {
              key: 0,
              part: WormAnatomy.HEAD,
              location: { row: 14, column: 10 },
            },
            {
              key: 1,
              part: WormAnatomy.BODY,
              location: { row: 13, column: 10 },
            },
            {
              key: 2,
              part: WormAnatomy.BODY,
              location: { row: 12, column: 10 },
            },
            {
              key: 3,
              part: WormAnatomy.TAIL,
              location: { row: 11, column: 10 },
            },
        ];
        const gameDimensions = {rows: 15, columns: 30};
        let gameGrid = getGridArray(gameDimensions);

        sandWorm.forEach((segment) => {
            const {row, column} = segment.location;
            const originalTile = {...gameGrid[row][column]};
            gameGrid[row][column] = {...originalTile, type: segment.part, data: segment};
        });

        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        const validNextMoves = [
            {
                direction: Direction.LEFT,
                coordinates: {row: 14, column: 9},
            },
            {
                direction: Direction.RIGHT,
                coordinates: {row: 14, column: 11},
            },
        ];

        const assertFilterValidNextMoves = [...validNextMoves];

        expect(filterValidPossibleMoves(validNextMoves, gameField)).toEqual(assertFilterValidNextMoves);
    });

    it('returns one option when only one are valid', () => {
        const sandWorm = [
            {
              key: 0,
              part: WormAnatomy.HEAD,
              location: { row: 14, column: 10 },
            },
            {
              key: 1,
              part: WormAnatomy.BODY,
              location: { row: 13, column: 10 },
            },
            {
              key: 2,
              part: WormAnatomy.BODY,
              location: { row: 12, column: 10 },
            },
            {
              key: 3,
              part: WormAnatomy.TAIL,
              location: { row: 11, column: 10 },
            },
        ];
        const gameDimensions = {rows: 15, columns: 30};
        let gameGrid = getGridArray(gameDimensions);

        sandWorm.forEach((segment) => {
            const {row, column} = segment.location;
            const originalTile = {...gameGrid[row][column]};
            gameGrid[row][column] = {...originalTile, type: segment.part, data: segment};
        });

        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        const invalidNextMoves = [
            {
                direction: Direction.DOWN,
                coordinates: {row: 15, column: 10},
            },
            {
                direction: Direction.RIGHT,
                coordinates: {row: 14, column: 11},
            },
        ];

        const assertFilterInvalidNextMoves = [
            {
                direction: Direction.RIGHT,
                coordinates: {row: 14, column: 11},
            },
        ];

        expect(filterValidPossibleMoves(invalidNextMoves, gameField)).toEqual(assertFilterInvalidNextMoves);
    });

    it('returns no options when none are valid', () => {
        const sandWorm = [
            {
              key: 0,
              part: WormAnatomy.HEAD,
              location: { row: 14, column: 10 },
            },
            {
              key: 1,
              part: WormAnatomy.BODY,
              location: { row: 13, column: 10 },
            },
            {
              key: 2,
              part: WormAnatomy.BODY,
              location: { row: 12, column: 10 },
            },
            {
              key: 3,
              part: WormAnatomy.TAIL,
              location: { row: 11, column: 10 },
            },
        ];
        const gameDimensions = {rows: 15, columns: 30};
        let gameGrid = getGridArray(gameDimensions);

        sandWorm.forEach((segment) => {
            const {row, column} = segment.location;
            const originalTile = {...gameGrid[row][column]};
            gameGrid[row][column] = {...originalTile, type: segment.part, data: segment};
        });

        const gameField = {
            tileGrid: gameGrid,
            boardSize: gameDimensions
        };

        const invalidNextMoves = [
            {
                direction: Direction.DOWN,
                coordinates: {row: 15, column: 9},
            },
            {
                direction: Direction.RIGHT,
                coordinates: {row: 14, column: 40},
            },
        ];

        const assertNoOptionsReturn = [];

        expect(filterValidPossibleMoves(invalidNextMoves, gameField)).toEqual(assertNoOptionsReturn);
    });

    describe('error handling', () => {
        const errorMessage = "There must be more than one possible move to validate.";

        it('throws error when next move options are missing', () => {
            const gameDimensions = {rows: 15, columns: 30};
            let gameGrid = getGridArray(gameDimensions);
    
            const gameField = {
                tileGrid: gameGrid,
                boardSize: gameDimensions
            };
            

            expect(() => filterValidPossibleMoves(null, gameField)).toThrow(errorMessage);
        })

        it('throws error when next move options has less than 2 options', () => {
            const gameDimensions = {rows: 15, columns: 30};
            let gameGrid = getGridArray(gameDimensions);
    
            const gameField = {
                tileGrid: gameGrid,
                boardSize: gameDimensions
            };
            
            const invalidNextMoves = [
                {
                    direction: Direction.LEFT,
                    coordinates: {row: 14, column: 9},
                },
            ];

            expect(() => filterValidPossibleMoves(invalidNextMoves, gameField)).toThrow(errorMessage);
        })

        it('throws error when game field is missing', () => {
            const validNextMoves = [
                {
                    direction: Direction.LEFT,
                    coordinates: {row: 14, column: 9},
                },
                {
                    direction: Direction.RIGHT,
                    coordinates: {row: 14, column: 11},
                },
            ];

            expect(() => filterValidPossibleMoves(validNextMoves, null)).toThrow(errorMessage);
        })
    });
});
