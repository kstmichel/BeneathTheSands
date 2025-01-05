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
