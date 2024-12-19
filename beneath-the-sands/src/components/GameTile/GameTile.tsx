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
            className={`grid-item border-black border-2
            ${    skin === TileSkin.Food ? 'bg-red' 
                : skin === TileSkin.Head ? 'bg-black'
                : skin === TileSkin.Body ? 'bg-white'
                : skin === TileSkin.Tail ? 'bg-green'
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