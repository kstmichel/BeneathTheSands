

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
