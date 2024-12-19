import Grid from '@mui/material/Grid2';

enum TileSkin {
    Sand = "sand",
    Food = "food", 
    Head = "head", 
    Tail = "tail", 
    Body = "body"
}

interface GameTileProps {
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
            ${    skin === TileSkin.Food ? 'bg-red-500' 
                : skin === TileSkin.Head ? 'bg-black'
                : skin === TileSkin.Body ? 'bg-white'
                : skin === TileSkin.Tail ? 'bg-gray-500'
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