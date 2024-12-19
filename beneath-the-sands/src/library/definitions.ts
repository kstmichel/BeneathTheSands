

export enum Display {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

export interface Dimension {
    columns: number;
    rows: number;
}

export const GameDimensions: Record<Display, Dimension> = {
    [Display.Mobile]: {
        columns: 15,
        rows: 10
    },
    [Display.Tablet]: {
        columns: 20,
        rows: 11
    },
    [Display.Desktop]: {
        columns: 30,
        rows: 15
    }
}
