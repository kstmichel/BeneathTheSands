import { GameField, Direction, GridCoordinates, NextMove, WormSegment } from './definitions';
import { validateNextMove, filterValidPossibleMoves, isBoundaryCollisionDetected } from './validation';

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

export const determineSandwormNextMove = (gameField: GameField, sandWorm: WormSegment[], wormDirection: Direction, inputDirection?: Direction): NextMove => {
    if(!gameField || !sandWorm || sandWorm.length === 0 || !wormDirection) throw new Error("Unable to determine sandworm next move. Invalid argumments were found.")
    
    try{
        const headCoordinates: GridCoordinates = sandWorm[0].location;

        if(inputDirection) {
            const nextMove: NextMove = getNextMove(headCoordinates, inputDirection);

            if (validateNextMove(nextMove, gameField)){
                return nextMove;
            }
        }

        const nextMoveByDefault: NextMove = getNextMove(headCoordinates, wormDirection);

        if (isBoundaryCollisionDetected(nextMoveByDefault, gameField)) {
            // Sandworm hit the boundary, move it in a random direction to keep things spicy!
            // TODO: increase difficulty as levels progress where hitting boundary means user loses the game
            return getRandomizedNextMove(gameField, headCoordinates, wormDirection);
        }

        return nextMoveByDefault;

    } catch (error) {
        throw new Error(`Issue occurred setting sandworm direction. ${error}`);
    }
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
        throw new Error(`All next moves are invalid.`);
    }

    return validMoves[0];
};