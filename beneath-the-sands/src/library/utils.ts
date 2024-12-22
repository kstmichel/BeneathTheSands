import { GameDimensions, Device} from './definitions';

export const getTotalTiles = (device: Device): number => GameDimensions[device].columns * GameDimensions[device].rows;

export function getLastItem<T>(array: T[]): T {
    return array[array.length - 1];
}
