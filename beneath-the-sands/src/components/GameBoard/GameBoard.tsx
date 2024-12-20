import {useState, useEffect, useRef, useCallback} from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { GameTile } from '../../components/';
import { GameDimensions, Device } from '../../library/definitions';
import { getTotalTiles } from '../../library/utils';
import { useGameContext } from '../../GameContext';

enum TileSkin {
    SAND = "sand",
    FOOD = "food", 
    HEAD = "head", 
    TAIL = "tail", 
    BODY = "body"
 };

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

type IWormPosition = Record<WormAnatomy, { row: number, column: number }[]>;

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
    
    const [deviceSize, setDeviceType] = useState<Device | null>(null); //TODO: Can be removed after development

    const [totalTiles, setTotalTiles] = useState<number>(0);
    const [tileSize, setTileSize] = useState(20);
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);
    const [grid, setGrid] = useState<string[][]>([]);
    const [wormPosition, setWormPosition] = useState<IWormPosition | null>({
        [WormAnatomy.HEAD]: [{ row: 7, column: 5 }],
        [WormAnatomy.BODY]: [
            { row: 7, column: 4 }, 
            { row: 7, column: 3 }
        ],
        [WormAnatomy.TAIL]: [{ row: 7, column: 2 }],
    });
    const [wormDirection, setWormDirection] = useState<WormDirection>(WormDirection.RIGHT);
    // const [inputDirection, setInputDirection] = useState<WormDirection | null>(null);

    const renderSandWormMovement = useCallback((newWormPosition: IWormPosition) => {
            /* So we have the new coordinates for the head, body, and tail of the sandworm.
               Now we need to update the tiles affected with the correct tile skin
               and reset the old position coordinates to sand (the previous tail position).
            */

            if(!grid || grid.length === 0 || !newWormPosition) return;

            let updatedGrid = [...grid];

            Object.keys(newWormPosition).forEach((part) => {
                // we don't want to get a new array for worm position, we want to update the tiles affected... 
                newWormPosition[part as WormAnatomy].forEach((coordinate) => {  
                    const { row, column } = coordinate;
                    updatedGrid[row] = [...updatedGrid[row]];
                    updatedGrid[row][column] = part;

                    // reset old tail with sand skin to give sandworm the illusion of moving across sand.
                    if(part === 'tail') {
                        updatedGrid[row][column - 1] = TileSkin.SAND;
                    }
                }); 
            });

            // Only update the grid if it has changed
            if (JSON.stringify(updatedGrid) !== JSON.stringify(grid)) {
                setGrid(updatedGrid);
            }
    }, [grid]);

    const moveSandWorm = useCallback(() => {
        // If going RIGHT, we STAY in same ROW and move to the RIGHT column
        // If going LEFT, we STAY in same ROW and move to the LEFT column
        // If going UP, we STAY in same COLUMN and move to the UP row
        // If going DOWN, we STAY in same COLUMN and move to the DOWN row

        if (!wormPosition) return null;

        let newWormPosition = { ...wormPosition };

        Object.keys(newWormPosition).forEach((part) => {
            newWormPosition[part as WormAnatomy] = newWormPosition[part as WormAnatomy].map((coordinate) => {
                let newCoordinate = { ...coordinate };

                switch (wormDirection) {
                    case WormDirection.RIGHT:
                    newCoordinate.column += 1;
                    break;
                    case WormDirection.LEFT:
                    newCoordinate.column -= 1;
                    break;
                    case WormDirection.UP:
                    newCoordinate.row -= 1;
                    break;
                    case WormDirection.DOWN:
                    newCoordinate.row += 1;
                    break;
                }

                return newCoordinate;
            });
        });

        setWormPosition((prevWormPosition) => {
            const updatedWormPosition = { ...prevWormPosition, ...newWormPosition };
            return updatedWormPosition;
        });

        renderSandWormMovement(newWormPosition);

    }, [wormPosition, wormDirection, renderSandWormMovement]);

    const generateTileSkinGrid = useCallback(async(rows: number, columns: number) => {
        const gridArrayOfTileSkinString = Array.from({ length: rows }, () =>
            Array.from({ length: columns }, () => TileSkin.SAND));
    
        const gridSkinsArray = gridArrayOfTileSkinString.map((row, rowIndex) => {

            return row.map((column, columnIndex) => {

                if (!wormPosition) return TileSkin.SAND;

                // Check if the current tile is part of the worm
                const wormPart = Object.keys(wormPosition).find((key): key is WormAnatomy => {
                    const positions = wormPosition[key as WormAnatomy];
                    return positions.some((coordinate) => {
                        return coordinate.row === rowIndex && coordinate.column === columnIndex;
                    });
                });

                if (wormPart) {
                    // Return the corresponding worm part (head, body, or tail)
                    return wormPart;
                }

                //TODO: These should be randomly placed on the grid (not hardcoded)
                const foodPositions = [
                    { row: 3, col: 3 },
                    { row: 5, col: 7 },
                    { row: 8, col: 1 },
                    { row: 9, col: 9 },
                ];

                // Check if the current tile is a food position
                const foodPositionDetected = foodPositions.find((position) => {
                    return position.row === rowIndex && position.col === columnIndex;
                });

                if (foodPositionDetected) {
                    return TileSkin.FOOD;
                }

                return column;
            });
        });
        
        return gridSkinsArray;
     }, [wormPosition]);

    const initGameBoardGrid = useCallback(async(deviceType: Device) => {
        setDeviceType(deviceType);

        // gameboard tile state
        const tileSize: number = updateTileSize(deviceType);
        setTileSize(tileSize);
        setTotalTiles(getTotalTiles(deviceType)); 

        setWormDirection(WormDirection.RIGHT); //TODO: this should appear random but based on the wormStartPosition

        const rows = GameDimensions[deviceType].rows;
        const columns = GameDimensions[deviceType].columns;

        setRows(rows);
        setColumns(columns);

        const gridSkinsArray = await generateTileSkinGrid(rows, columns);

        setGrid(gridSkinsArray);

    }, [generateTileSkinGrid]);

    const updateTileSize = (deviceType: Device): number => {
        const containerWidth = window.innerWidth * 0.9;
        const containerHeight = window.innerHeight * 0.9;

        // Calculate the maximum possible size for a square tile
        const size = Math.min(
            containerWidth / GameDimensions[deviceType].columns,
            containerHeight / GameDimensions[deviceType].rows
        );

        return size;
    };
        
    useEffect(() => {
        const initializeGame = async () => {
            // Initialize the grid based on the Device size
            const deviceType: Device = isMobile 
                ? Device.Mobile 
                : isTablet 
                ? Device.Tablet 
                : Device.Desktop;

            // initial render has occurred
            if (initialRef.current) {
                initialRef.current = false;

                await initGameBoardGrid(deviceType);
            }

            // Update size on window resize
            const handleResize = () => updateTileSize(deviceType);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }

        initializeGame();

    }, [isMobile, isTablet, initGameBoardGrid]);

    useEffect(() => {
        const interval = setInterval(() => {
            // TODO: Check for collisions with walls, food, or itself

            // Update the grid with the new worm position
            moveSandWorm();

            // TODO: Update the game state (score, worm length, food eaten, etc.)

        }, 1000);
    
        return () => clearInterval(interval);
    }, [moveSandWorm]);
    
    return (
        <>
         <Box data-testid="game-board" >
            {/* 
            Suggested Grid Sizes:
                - Small Screens (Mobile):
                  15x10: Great for a smaller Device, keeps gameplay focused.
                - Medium Screens (Tablets/Small Monitors):
                  20x11: Provides a good balance of challenge and visibility.
                - Large Screens (Desktops):
                  30x15: Allows for more complex movement and strategies. 
            */}
            {deviceSize}: {totalTiles} tiles

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
                    grid && grid.map((row, rowIndex) => (
                        <Grid container direction="row" key={rowIndex} wrap="nowrap" className="m-auto">
                            {row.map((tile, columnIndex) => (
                                <GameTile 
                                    key={columnIndex}
                                    skin={tile as TileSkin} 
                                    size={tileSize}         
                                    onCollision={()=> console.log('collision')} />
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