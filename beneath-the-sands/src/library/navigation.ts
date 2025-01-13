import { Direction, WormSegment } from './definitions';

export const setupWormPath = (wormLength: number, wormDirection: Direction): Direction[] => {
    if(!wormLength || wormLength === 0 || !wormDirection) throw new Error('Issue occurred while setting up worm path. Invalid worm length or worm direction.');

    let path = [];

    for(let i = 0; i <= wormLength - 1; i++) {
        path.push(wormDirection);
    }

    return path;
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
