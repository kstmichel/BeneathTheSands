import { GameDimensions, Device, Direction} from './definitions';

export const getTotalTiles = (device: Device): number => GameDimensions[device].columns * GameDimensions[device].rows;

export function getLastItem<T>(array: T[]): T {
    return array[array.length - 1];
}

export function getRandomizedDirectionOptions(options: Direction[]) {
    const randomInt: number = Math.random();
    const randomDirection = randomInt < 0.5 ? options[0] : options[1];
    const remainingOption = options.filter((option) => option !== randomDirection)[0];
    const randomizedOptions: Direction[] = [randomDirection, remainingOption];

    return randomizedOptions;
};


export const isOppositeDirection = (direction: Direction, compareDirection: Direction): boolean => {
    if(!direction || !compareDirection) throw new Error('Cannot detect opposite direction used.');

    let isOppositeDirection: boolean = false;

    switch(direction) {
        case Direction.UP:
            if (compareDirection === Direction.DOWN) { isOppositeDirection = true; }
            break;

        case Direction.DOWN:
            if(compareDirection === Direction.UP) isOppositeDirection = true;
            break;

        case Direction.LEFT: 
            if(compareDirection === Direction.RIGHT) isOppositeDirection = true;
            break;

        case Direction.RIGHT:
            if(compareDirection === Direction.LEFT) isOppositeDirection = true;
            break;
    }
    
    return isOppositeDirection;
};