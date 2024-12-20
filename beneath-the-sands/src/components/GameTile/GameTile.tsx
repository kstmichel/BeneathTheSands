import Grid from '@mui/material/Grid2';

enum TileSkin {
    SAND = "sand",
    FOOD = "food", 
    HEAD = "head", 
    TAIL = "tail", 
    BODY = "body"
}

export interface GameTileProps {
    skin: TileSkin;
    size: number;
    children?: React.ReactNode;
    onCollision: () => void;
}

const GameTile = ({skin, size, children, onCollision}: GameTileProps) => {
    return (
        <Grid 
            data-testid="game-tile"
            className={`grid-item border-orange-200 border-2
            ${    skin === TileSkin.FOOD ? 'bg-red-500' 
                : skin === TileSkin.HEAD ? 'bg-black'
                : skin === TileSkin.BODY ? 'bg-white'
                : skin === TileSkin.TAIL ? 'bg-gray-500'
            : 'bg-orange-300'
            }`}
            style={{width: size, height: size}}
        >
                <div className="grid-item-content">
                    <h3>{children}</h3>
                </div>
        </Grid>
    );
}

export default GameTile;