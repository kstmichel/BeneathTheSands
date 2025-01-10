import { DeviceConstraints, WindowSize, GameGrid, GameDimensions, Device, Dimension, Direction, NextMove, GridCoordinates, Tile, GroundTexture, WormSegment} from './definitions';

export const getDeviceType = (windowSize: WindowSize): Device => {
    if(!windowSize || windowSize.width === 0) throw new Error('Issue occurred while determining device type. Window size was invalid.');

    const isMobile = windowSize.width <= DeviceConstraints.mobile;
    const isTablet = windowSize.width <= DeviceConstraints.tablet;

    return isMobile 
                ? Device.Mobile 
                : isTablet 
                ? Device.Tablet 
                : Device.Desktop;

};

export const getGridArray = (dimensions: Dimension): GameGrid => {
    if(!dimensions.rows || dimensions.rows === 0 || !dimensions.columns || dimensions.columns === 0 ) {
        throw new Error('Invalid grid dimensions or tile size.');
    }

    return(
        Array.from({ length: dimensions.rows }, (k, r) =>
            Array.from({ length: dimensions.columns }, (k, c) => (
                {
                    type: GroundTexture.SAND, 
                    data: {
                        location: {
                            row: r, 
                            column: c
                        }
                    }
                } as Tile)
            )
        )
    )
};

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

export const getDirectionByWormPath = (wormPath: Direction[], segment: WormSegment): Direction => {
    if(!wormPath || wormPath.length === 0 || !segment || segment.key === undefined) throw new Error('Error occurred getting direction from worm path. Invalid worm path or segment.');

    return wormPath[segment.key];
};

export const addNewDirectionToWormPath = (direction: Direction, wormPath: Direction[]) => {
    /*  
        Each item in the array represents a segment of the Sandworm ([H, B, B, T]), 
        and the values are the direction in which that segment must move. 

        Example Worm Path: [UP, RIGHT, RIGHT, DOWN]
    */

    if(!direction || !wormPath || wormPath.length === 0) throw new Error('Issue occurred when adding new direction to worm path. Invalid direction or worm path.')

    let updatedWormPath = wormPath;

    updatedWormPath.unshift(direction);
    updatedWormPath.pop();

    return updatedWormPath;
};

export const setupWormPath = (wormLength: number, wormDirection: Direction): Direction[] => {
    if(!wormLength || wormLength === 0 || !wormDirection) throw new Error('Issue occurred while setting up worm path. Invalid worm length or worm direction.');

    let path = [];

    for(let i = 0; i <= wormLength - 1; i++) {
        path.push(wormDirection);
    }

    return path;
};

export const extendWormPath = (wormLength: number, wormPath: Direction[]): Direction[] => {
    if(!wormLength || wormLength === 0 || !wormPath || wormPath.length === 0) throw new Error("Issued occurred updating worm path. Invalid worm length or worm path.")
    
    // update worm path based on new worm length, extending tail direction in the path.
    let path = [];

    for(let i = 0; i <= wormLength - 1; i++) {
        if(i > wormPath.length - 1) {
            path.push(wormPath[wormPath.length - 1]);
        } else {
            path.push(wormPath[i]);
        }
    }

    return path;
};

export const getTileSize = (window: Window, deviceType: Device): number => {
    if(!window || !deviceType) throw new Error('Issue occurred during tile size calculation. Invalid window or device.');
    
    const containerWidth = window.innerWidth * 0.9;
    const containerHeight = window.innerHeight * 0.9;

    // Calculate the maximum possible size for a square tile
    const size: number = Math.min(
        containerWidth / GameDimensions[deviceType].columns,
        containerHeight / GameDimensions[deviceType].rows
    );

    return size;
};

export const getTotalTiles = (dimensions: Dimension): number => {
    if(!dimensions) throw new Error('Cannot calculate total tiles. Missing dimensions.');

    return dimensions.rows * dimensions.columns;
}
