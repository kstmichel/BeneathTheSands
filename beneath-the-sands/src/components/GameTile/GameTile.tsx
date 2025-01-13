import React from 'react';
import Grid from '@mui/material/Grid2';
import { Tile } from '../../library/definitions';

export interface GameTileProps {
    tile: Tile;
    size: number;
    children?: React.ReactNode;
    onCollision: () => void;
}

const GameTile = ({tile, size, children, onCollision}: GameTileProps) => {
    if(!tile || !tile.data) throw new Error('Game tile rendering error occurred.');

    const {type, data} = tile;
    const {row, column} = data.location;
    
    return (
        <Grid 
            title="grid-tile"
            id={`tile-${row}-${column}`}
            data-testid={`tile-${row}-${column}`}
            className={`grid-tile border-orange-200 border-2 tile-texture--${type}`}
            style={{width: size, height: size}}
        >
                <div 
                    data-testid={`tile-type-${type}`}
                    className="grid-tile--content"
                >
                    <h3>{children}</h3>
                </div>
        </Grid>
    );
}

export default GameTile;