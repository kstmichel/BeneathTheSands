

export enum Device {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

export interface Dimension {
    columns: number;
    rows: number;
}

export const GameDimensions: Record<Device, Dimension> = {
    [Device.Mobile]: {
        columns: 15,
        rows: 10
    },
    [Device.Tablet]: {
        columns: 20,
        rows: 11
    },
    [Device.Desktop]: {
        columns: 30,
        rows: 15
    }
}

export interface GridCoordinates {
    row: number;
    column: number;
}

export enum Direction {
    UP = "UP",
    DOWN = "DOWN", 
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export enum TileTexture {
    SAND = "sand",
    FOOD = "food", 
    HEAD = "head", 
    TAIL = "tail", 
    BODY = "body"
};

export enum WormAnatomy {
    HEAD = "head",
    BODY = "body",
    TAIL = "tail"
}

export interface WormSegment {
    key: number,
    part: WormAnatomy,
    location: GridCoordinates
}