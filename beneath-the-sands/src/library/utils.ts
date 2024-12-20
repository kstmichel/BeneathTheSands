import { GameDimensions, Device } from './definitions';

export const getTotalTiles = (device: Device): number => GameDimensions[device].columns * GameDimensions[device].rows;
