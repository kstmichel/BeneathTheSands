export const initialWormLength = 4;

export enum Device {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

export enum Direction {
    UP = "UP",
    DOWN = "DOWN", 
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export enum GroundTexture {
    SAND = "sand",
    FOOD = "food", 
};

export enum WormAnatomy {
    HEAD = "head",
    BODY = "body",
    TAIL = "tail"
}

export interface GameData {
    sandWorm: WormSegment[],
    food: Food[],
    startDirection: Direction,
}

export type GameGrid = Tile[][];

export interface Dimension {
    rows: number;
    columns: number;
}

export interface GameField {
    tileGrid: GameGrid,
    boardSize: Dimension
}

export const GameDimensions: Record<Device, Dimension> = {
    [Device.Mobile]: {
        rows: 10,
        columns: 15
    },
    [Device.Tablet]: {
        rows: 11,
        columns: 20
    },
    [Device.Desktop]: {
        rows: 15,
        columns: 30
    }
}

export interface GridCoordinates {
    row: number;
    column: number;
}

export interface Tile {
    type: GroundTexture | WormAnatomy,
    size: number,
    data?: Sand | Food | WormSegment,
}

interface TileData {
    location: GridCoordinates
}

export interface NextMove {
    direction: Direction,
    coordinates: GridCoordinates,
    tile?: Tile,
}

export interface Sand extends TileData {
    variant: string,
} 

export interface Food extends TileData {
    variant: string,
} 

export interface WormSegment extends TileData {
    key: number,
    part: WormAnatomy,
} 
