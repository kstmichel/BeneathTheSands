import { getNextMove, getOppositeDirection, getRandomizedPossibleDirections } from './movement';
import { Direction } from './definitions';

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
