import Grid from '@mui/material/Grid2';
import { TileTexture, GridCoordinates } from '../../library/definitions';

export interface GameTileProps {
    texture: TileTexture;
    size: number;
    coordinate: GridCoordinates;
    children?: React.ReactNode;
    onCollision: () => void;
}

const GameTile = ({texture, size, coordinate, children, onCollision}: GameTileProps) => {
    const {row, column} = coordinate;

    return (
        <Grid 
            data-testid={`tile-${row}-${column}`}
            className={`grid-item border-orange-200 border-2 tile-texture--${texture}`}
            style={{width: size, height: size}}
        >
                <div className="grid-item-content">
                    <h3>{children}</h3>
                </div>
        </Grid>
    );
}

export default GameTile;