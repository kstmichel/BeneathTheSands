import { getNextMove, getOppositeDirection, getRandomizedPossibleDirections, determineSandwormNextMove } from './movement';
import { getGridArray } from './gameGrid';
import { Direction, WormAnatomy } from './definitions';

describe('getNextMove Movement Function', () => {
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

describe('getOppositeDirection Movement Function', () => {
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

describe('getRandomizedPossibleDirections Movement Function', () => {
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

describe('determineSandwormNextMove Movement Function', () => {
    it('returns next move based on input when inputDirection is provided', () => {
        const sandwormData = [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ];

        const dimensions = {rows: 15, columns: 30};
        const gameBoardArray = getGridArray(dimensions);
        const gameField = {tileGrid: gameBoardArray, boardSize: dimensions};
        const inputDirection = Direction.UP;
        const defaultDirection = Direction.RIGHT;
        const nextMove = determineSandwormNextMove(gameField, sandwormData, defaultDirection, inputDirection);

        expect(nextMove.direction).toBe(inputDirection);
    });

    it('returns next move based on default worm direction when inputDirection is undefined', () => {
        const sandwormData = [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ];

        const dimensions = {rows: 15, columns: 30};
        const gameBoardArray = getGridArray(dimensions);
        const gameField = {tileGrid: gameBoardArray, boardSize: dimensions};
        const defaultDirection = Direction.RIGHT;
        const nextMove = determineSandwormNextMove(gameField, sandwormData, defaultDirection);

        expect(nextMove.direction).toBe(defaultDirection);
    });

    describe('error handling', () => {
        const missingArgumentErrorMessage = "Unable to determine sandworm next move. Invalid argumments were found.";
        const tryCatchErroMessage = "Issue occurred setting sandworm direction. Error: All next moves are invalid.";

        const sandwormData = [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ];

        const dimensions = {rows: 15, columns: 30};
        const gameBoardArray = getGridArray(dimensions);
        const gameField = {tileGrid: gameBoardArray, boardSize: dimensions};
        const inputDirection = Direction.UP;
        const defaultDirection = Direction.RIGHT;

        it('throws an error when gameField is null', () => {    
            expect(() => determineSandwormNextMove(null, sandwormData, defaultDirection, inputDirection)).toThrow(missingArgumentErrorMessage);
        });

        it('throws an error when sandworm is null', () => {    
            expect(() => determineSandwormNextMove(gameField, null, defaultDirection, inputDirection)).toThrow(missingArgumentErrorMessage);
        });

        it('throws an error when sandworm array is empty', () => {    
            expect(() => determineSandwormNextMove(gameField, [], defaultDirection, inputDirection)).toThrow(missingArgumentErrorMessage);
        });

        it('throws an error when defaultDirection is null', () => {    
            expect(() => determineSandwormNextMove(gameField, sandwormData, null, inputDirection)).toThrow(missingArgumentErrorMessage);
        });

        it('DOES NOT throw an error when inputDirection is null', () => {    
            expect(() => determineSandwormNextMove(gameField, sandwormData, defaultDirection, null)).not.toThrow(missingArgumentErrorMessage);
        });

        it('throws an error when it cannot find valid next move', () => {
            const sandwormData = [
                { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 11 } },
                { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 10 } },
                { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
                { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 8 } },
              ];
    
            const dimensions = {rows: 15, columns: 10};
            const gameBoardArray = getGridArray(dimensions);
            const gameField = {tileGrid: gameBoardArray, boardSize: dimensions};
            const inputDirection = Direction.UP;
            const defaultDirection = Direction.RIGHT;;
    
            expect(() => determineSandwormNextMove(gameField, sandwormData, defaultDirection, inputDirection)).toThrow(tryCatchErroMessage);
        });
    });
});
