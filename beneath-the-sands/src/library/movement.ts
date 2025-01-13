import { GameField, Direction, GridCoordinates, NextMove } from './definitions';
import { filterValidPossibleMoves } from './validation';

export const getNextMove = (coordinates: GridCoordinates, direction: Direction): NextMove  => {
    if (!coordinates || !direction) throw new Error('Cannot get next coordinate because coordinate or direction are invalid.');
 
     let newCoordinates = {...coordinates};
 
     switch (direction) {    
         case Direction.RIGHT:
             newCoordinates.column += 1
             break;
         case Direction.LEFT:
             newCoordinates.column -= 1
             break;
         case Direction.UP:
             newCoordinates.row -= 1
             break;
         case Direction.DOWN:
             newCoordinates.row += 1
             break;
     }
 
     const nextMove: NextMove = {
         direction: direction, 
         coordinates: newCoordinates,
     };
 
     return nextMove;
 };
 
export const getOppositeDirection = (direction: Direction): Direction => {
    if(!direction) throw new Error('Cannot return opposite direction when direction argument is invalid.');

    let oppositeDirection: Direction;

    switch (direction) {
        case Direction.RIGHT:
            oppositeDirection = Direction.LEFT;
            break;
        case Direction.LEFT:
            oppositeDirection = Direction.RIGHT;
            break;
        case Direction.UP:
            oppositeDirection = Direction.DOWN;
            break;
        case Direction.DOWN:
            oppositeDirection = Direction.UP;
            break;
    }

    return oppositeDirection;
};  

export function getRandomizedPossibleDirections(direction: Direction): Direction[] {
    if(!direction) throw new Error('Issue occurred while getting possible directions, missing current direction.');

    const directionalOptions: Direction[] = direction === Direction.RIGHT || direction === Direction.LEFT
        ? [Direction.UP, Direction.DOWN]
        : [Direction.LEFT, Direction.RIGHT];

    const randomInt: number = Math.random();
    const randomDirection = randomInt < 0.5 ? directionalOptions[0] : directionalOptions[1];
    const remainingOption = directionalOptions.filter((option) => option !== randomDirection)[0];
    const randomizedOptions: Direction[] = [randomDirection, remainingOption];

    return randomizedOptions;
};

export const getRandomizedNextMove = (gameField: GameField, coordinates: GridCoordinates, direction: Direction): NextMove => {
    if(!coordinates) throw new Error('Issue occurred getting random next move. Invalid coordinates');

    const directionOptions: Direction[] = getRandomizedPossibleDirections(direction); 
    let nextMoveOptions: NextMove[] = [];

    directionOptions.forEach((direction: Direction) => {
        const nextMove: NextMove = getNextMove(coordinates, direction);
        nextMoveOptions.push(nextMove);
    });

    const validMoves: NextMove[] = filterValidPossibleMoves(nextMoveOptions, gameField);

    if(validMoves.length === 0) {
        throw new Error(`All next moves are invalid: ${nextMoveOptions}`);
    }

    return validMoves[0];
};