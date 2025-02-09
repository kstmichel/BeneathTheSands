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
    sandWorm: {
        startDirection: Direction,
        segments: WormSegment[]
    },
    food: Food[],
}

export interface ContextData {
    levels: Level[]
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

export interface WindowConstraint {
    maxWidth: number,
}

export interface WindowSize {
    width: number,
    height: number
}

const maxMobileWidth = 768;
const maxTabletWidth = 1024;

export const DeviceConstraints = {
    mobile: maxMobileWidth, 
    tablet: maxTabletWidth
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

export interface DropInventory {
    food: number;
}

export interface Level {
    drops: {
        food: number,
        coins: number, 
        rubies: number
    },
    speed: number
}

export interface GridCoordinates {
    row: number;
    column: number;
}

export interface Tile {
    type: TileType,
    data: TileData,
}

export type TileType = GroundTexture | WormAnatomy;

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
