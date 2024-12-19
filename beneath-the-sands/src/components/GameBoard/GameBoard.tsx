import React, {useState, useEffect, useRef} from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { GameTile } from '../../components/';
import { GameDimensions, Display } from '../../library/definitions';
import { getTotalTiles } from '../../library/utils';
import { useGameContext } from '../../GameContext';

enum TileSkin {
    Sand = "sand",
    Food = "food", 
    Head = "head", 
    Tail = "tail", 
    Body = "body"
}

enum WormDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right"
}

enum WormAnatomy {
    HEAD = "head",
    BODY = "body",
    TAIL = "tail"
}

interface GameBoardProps {
    windowSize: {
        width: number;
        height: number;
    }
}

function GameBoard({windowSize}: GameBoardProps) {
    const initialRef = useRef(true);

    const { level, wormLength, score, foodEaten, gameOver, gameWon } = useGameContext();

    const isMobile = windowSize.width <= 768;
    const isTablet = windowSize.width <= 1024;
    
    const [displaySize, setDisplaySize] = useState<Display | null>(null);
    const [totalTiles, setTotalTiles] = useState<number>(0);
    const [tileSize, setTileSize] = useState(20);
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);
    const [grid, setGrid] = useState<string[][]>([]);
    const [wormPosition, setWormPosition] = useState<{[key in WormAnatomy]: {row: number, col: number}[]} | null>(null);

  useEffect(() => {
    const displaySize: Display = isMobile 
    ? Display.Mobile 
    : isTablet 
      ? Display.Tablet 
      : Display.Desktop;

    setDisplaySize(displaySize);
    setTotalTiles(getTotalTiles(displaySize));

    const numRows = GameDimensions[displaySize].rows;
    const numColumns = GameDimensions[displaySize].columns;

    setRows(numRows);
    setColumns(numColumns);

    const updateTileSize = () => {
      const containerWidth = window.innerWidth * 0.9; // 90% of viewport width
      const containerHeight = window.innerHeight * 0.9; // 90% of viewport height

      // Calculate the maximum possible size for a square tile
      const size = Math.min(
        containerWidth / numColumns,
        containerHeight / numRows
      );

      setTileSize(size);
    };

    // Initial size calculation
    updateTileSize();

    // Initialize the grid tile skins
    const updateGrid = () => {
        // only update the grid if the initial render has occurred
        if (initialRef.current) {
            initialRef.current = false;

            // Set initial grid with sand tiles
            const initialGrid = Array.from({ length: numRows }, () =>
                Array.from({ length: numColumns }, () => TileSkin.Sand)
            );

            //TODO: This should be randomly placed on the grid (not hardcoded).
            //      These must also be connected in a straight line.
            const wormStartPosition = {
                [WormAnatomy.HEAD]: [{ row: 7, col: 5 }],
                [WormAnatomy.BODY]: [
                    { row: 7, col: 4 }, 
                    { row: 7, col: 3 }
                ],
                [WormAnatomy.TAIL]: [{ row: 7, col: 2 }],
            };

            //TODO: These should be randomly placed on the grid (not hardcoded)
            const foodPositions = [
                { row: 3, col: 3 },
                { row: 5, col: 7 },
                { row: 8, col: 1 },
                { row: 9, col: 9 },
            ];

            //TODO: Need to add testing to make sure the random food positions are 
            //      not the same as the worm position.
            setWormPosition(wormStartPosition);
            
            const reskinGrid = initialGrid.map((row, rowIndex) => {
                return row.map((tileSkin, columnIndex) => {

                    // Check if the current tile is part of the worm
                    const wormPart = Object.keys(wormStartPosition).find((key) => {
                        const positions = wormStartPosition[key as WormAnatomy];
                        return positions.some((coordinate) => {
                            return coordinate.row === rowIndex && coordinate.col === columnIndex;
                        });
                    });

                    if (wormPart) {
                        // Return the corresponding worm part (head, body, or tail)
                        return wormPart;
                    }

                    // Check if the current tile is a food position
                    const foodPositionDetected = foodPositions.find((position) => {
                        return position.row === rowIndex && position.col === columnIndex;
                    });

                    if (foodPositionDetected) {
                        return TileSkin.Food;
                    }

                    return tileSkin;
                });
            });
    
            setGrid(reskinGrid);    
        }
    }

    updateGrid();

    // Update size on window resize
    window.addEventListener("resize", updateTileSize);
    return () => window.removeEventListener("resize", updateTileSize);

  }, [isMobile, isTablet]);


    return (
        <>
         <Box data-testid="game-board" >
            {/* 
            Suggested Grid Sizes:
                - Small Screens (Mobile):
                  15x10: Great for a smaller display, keeps gameplay focused.
                - Medium Screens (Tablets/Small Monitors):
                  20x11: Provides a good balance of challenge and visibility.
                - Large Screens (Desktops):
                  30x15: Allows for more complex movement and strategies. 
            */}
            {displaySize}: {totalTiles} tiles

            <Box className="justify-start text-left absolute bottom-8 left-8 ">
                <Typography variant="h6" style={{fontWeight: '600'}}>Beneath the Sands</Typography>
                <ul>
                    <li>Level: {level}</li>
                    <li>Worm Length: {wormLength}</li>
                    <li>Food Eaten: {foodEaten}</li>
                    <li>Score: {score}</li>
                    <li>Game Over: {String(gameOver)}</li>
                    <li>Game Won: {String(gameWon)}</li>
                </ul>
            </Box>

            <Grid 
                container 
                direction={'column'} 
                wrap="wrap" 
                className="grid-container"
                style={{
                    gridTemplateColumns: `repeat(${rows}, 1fr)`,
                    gridTemplateRows: `repeat(${columns}, 1fr)`,
                  }}
            >
                {
                    grid.map((row, rowIndex) => (
                        <Grid container direction="row" key={rowIndex} wrap="nowrap" className="m-auto">
                            {row.map((tile, columnIndex) => (
                                <GameTile key={columnIndex} skin={tile as TileSkin} size={tileSize} onCollision={()=> console.log('collision')} />
                            ))}
                        </Grid>
                    ))
                }
            </Grid>
         </Box>
        </>
    )
}

export default GameBoard;