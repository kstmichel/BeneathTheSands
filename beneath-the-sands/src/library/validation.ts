import { GameField, Tile, NextMove, GridCoordinates, WormAnatomy, WormSegment } from "./definitions";

export const validateNextMove = (nextMove: NextMove, gameField: GameField): boolean => {
    if(!nextMove || !nextMove.coordinates || !gameField || !gameField.tileGrid) throw new Error('Issue occurred when validating direction. Invalid coordinates, direction, or game dimension.');
    
    if (isBoundaryCollisionDetected(nextMove, gameField)) return false;

    const {row, column} = nextMove.coordinates;
    const nextTile: Tile = gameField.tileGrid[row][column];
    
    return !isReversingDirection(nextTile);
};

export const isBoundaryCollisionDetected = (nextMove: NextMove, gameField: GameField): boolean => {
    if(!nextMove || !nextMove.coordinates || !gameField || !gameField.boardSize) throw new Error('Issue occurred while checking for boundary collision. Invalid next move or game field.')

    const { row, column }: GridCoordinates = nextMove.coordinates;
    const yBoundaryCollision: boolean = row < 0 || row > (gameField.boardSize.rows - 1);

    if (yBoundaryCollision) return true;

    const xBoundaryCollision: boolean = column < 0 || column > (gameField.boardSize.columns - 1);

    return xBoundaryCollision;
};

export const isReversingDirection = (nextTile: Tile): boolean => {
    if(!nextTile) throw new Error('Issue occurred while determining if sandworm is reversing direction. Invalid tile argument.')

    const leadingBodySegmentKey: number = 1;
    const isReversing: boolean = nextTile.type === WormAnatomy.BODY && (nextTile.data as WormSegment)?.key === leadingBodySegmentKey;

    return isReversing;
};

export const filterValidPossibleMoves = (moveOptions: NextMove[], gameField: GameField): NextMove[] => {
    if(!moveOptions || moveOptions.length < 2 || !gameField) throw new Error('There must be more than one possible move to validate.');

    return moveOptions.filter((move: NextMove) => validateNextMove(move, gameField));
};
