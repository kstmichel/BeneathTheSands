import { GameDimensions, Display } from './definitions';

export const getTotalTiles = (display: Display): number => GameDimensions[display].columns * GameDimensions[display].rows;
