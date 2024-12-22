import {useState, useEffect, useRef, useCallback} from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { GameTile } from '../../components/';
import { GameDimensions, Device, Direction} from '../../library/definitions';
import { getTotalTiles, getLastItem } from '../../library/utils';
import { useGameContext } from '../../GameContext';

enum TileSkin {
    SAND = "sand",
    FOOD = "food", 
    HEAD = "head", 
    TAIL = "tail", 
    BODY = "body"
};

enum WormAnatomy {
    HEAD = "head",
    BODY = "body",
    TAIL = "tail"
}

interface GridCoordinates {
    row: number;
    column: number;
}

interface WormSegment {
    key: number,
    part: WormAnatomy,
    location: GridCoordinates
}

type WormLocationByPart = WormSegment[];

const initialWormLocationByParts: WormLocationByPart = [
    { 
        key: 0,
        part: WormAnatomy.HEAD,
        location: { row: 7, column: 10} 
    },
    { 
        key: 1,
        part: WormAnatomy.BODY,
        location: { row: 7, column: 9} 
    }, 
    { 
        key: 2,
        part: WormAnatomy.BODY,
        location: { row: 7, column: 8} 
    },
    { 
        key: 3,
        part: WormAnatomy.TAIL,
        location: {row: 7, column: 7} 
    },
];

const initialWormDirection = Direction.RIGHT;

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
    const [wormDirection, setWormDirection] = useState<Direction>(initialWormDirection);
    const [wormLocation, setWormLocation] = useState<WormLocationByPart>(initialWormLocationByParts);
    const [tempGameOver, setTempGameOver] = useState<boolean>(false);
    const [wormPath, setWormPath] = useState<Direction[]>([]);

    // const [inputDirection, setInputDirection] = useState<Direction | null>(null);

    const renderSandWormMovement = useCallback((newWormLocation: WormLocationByPart) => {
         /*
            This function expects wormLocation to have updated segment locations 
            for each part (head/body/tail) of the Sandworm. Now we are updating the game board
            tiles with the new location of the Sandworm.
        */
       
        if (!grid || grid.length === 0 || !newWormLocation) return;

        let updatedGrid = [...grid];

        // we don't want to get a new array for worm location, we want to update the tiles affected... 
        newWormLocation.forEach((segment: WormSegment) => {  
            const { part, location } = segment;
            const { row, column } = location;

            updatedGrid[row] = [...updatedGrid[row]];
            updatedGrid[row][column] = part;
            
            // reset old tail with sand skin to give sandworm the illusion of moving across sand.
            if (part === 'tail') {
                const tailDirection = getLastItem(wormPath);

                switch (tailDirection) {
                    case Direction.RIGHT:
                        updatedGrid[row][column - 1] = TileSkin.SAND;
                        break;
                    case Direction.LEFT:
                        updatedGrid[row][column + 1] = TileSkin.SAND;
                        break;
                    case Direction.UP:
                        updatedGrid[row + 1][column] = TileSkin.SAND;
                        break;
                    case Direction.DOWN:
                        updatedGrid[row - 1][column] = TileSkin.SAND;
                        break;
                }
            }
        }); 

        // Only update the grid if it has changed
        if (JSON.stringify(updatedGrid) !== JSON.stringify(grid)) {
            setGrid(updatedGrid);
        }
    }, [grid, wormPath]);

    const getRandomizedDirectionOptions = (options: Direction[]) => {
        const randomInt: number = Math.random();
        const randomDirection = randomInt < 0.5 ? options[0] : options[1];
        const remainingOption = options.filter((option) => option !== randomDirection)[0];
        const randomizedOptions: Direction[] = [randomDirection, remainingOption];

        return randomizedOptions;
    };

    const validateNextMove = useCallback((segment: WormSegment, direction: Direction) => {
        const { row, column } = segment.location;
        const maxRow: number = rows - 1;
        const maxColumn: number = columns - 1;

        switch (direction) {
            case Direction.RIGHT:
                if (column + 1 > maxColumn){
                    return false;
                }
                break;
            case Direction.LEFT:
                if (column - 1 < 0){
                    return false;
                }

                break;
            case Direction.UP:
                if (row - 1 < 0){
                    return false;
                }

                break;
            case Direction.DOWN:
                if (row + 1 > maxRow){
                    return false;
                }
                break;
        }

        return true;

    }, [columns, rows]);
 
    const getRandomDirectionBasedOnMovement = useCallback((head: WormSegment) => {
        // oh, we hit the maxCol boundary. let's change the sandworm direction UP or DOWN randomly for fun.
        let safeOption: Direction | null = null;

        // set directional options
        const directionalOptions: Direction[] = wormDirection === Direction.RIGHT || wormDirection === Direction.LEFT
            ? [Direction.UP, Direction.DOWN]
            : [Direction.LEFT, Direction.RIGHT];

        const randomizedOptions: Direction[] = getRandomizedDirectionOptions(directionalOptions);

        randomizedOptions.forEach((option) => {   
            const isValidMove: boolean = validateNextMove(head, option);         
            
            if(isValidMove) {
                safeOption = option;
            };
        });

        if(!safeOption) {
            throw new Error('No safe direction found.');
        }
        
        return safeOption;
    }, [validateNextMove, wormDirection]);

    const getWormPathDirection = useCallback((path: Direction[], segment: WormSegment): Direction => {
        if(!path || path.length === 0) throw new Error('Worm path is null or empty.');

        return path[segment.key];
    }, []);

    const moveSandWorm = useCallback(async () => {
        /*
            This function is for mutating the location data for each segmented part of the Sandworm.
        */
        if (!wormLocation) return null;

        let newWormLocation = [ ...wormLocation ]; 

        // Update the location of each segment based on the segment direction. 
        newWormLocation = await Promise.all(newWormLocation.map(async (segment) => {

            let updatedSegment = { ...segment };
            let updatedPath = wormPath;
            let segmentDirection: Direction = wormDirection;

            /*
                we need to check to see if the sandworm needs to change direction (hit the boundary)
                before actually mutating the location coordinate data.
            */

            if (segment.part === WormAnatomy.HEAD) {

                // Validate the next move in default direction to detect boundary collision
                const safeMove: boolean = validateNextMove(updatedSegment, wormDirection);

                if (!safeMove) {     
                    // Move is not safe as it collides with boundary, move sandworm to available direction (random)
                    segmentDirection = getRandomDirectionBasedOnMovement(updatedSegment);
                }

                /*  
                    Each item in the array represents a segment of the Sandworm ([H, B, B, T]), 
                    and the values are the direction in which that segment must move. 

                    Example Worm Path: [UP, RIGHT, RIGHT, DOWN]

                    The Worm path is updated with new HEAD direction inserted at beginning of array,
                    and last item in array is removed to record the sandworm path and move in a worm-like fashion.
                */
                
                updatedPath.unshift(segmentDirection);
                updatedPath.pop();

                 // set direction in state for when no input is detected
                setWormDirection(segmentDirection);

            } else {
                // check the worm path for this segment's direction to modify it's location coordinates below.
                segmentDirection = getWormPathDirection(wormPath, segment);
            }

            setWormPath(updatedPath);

            switch (segmentDirection) {
                case Direction.RIGHT:
                    updatedSegment.location.column += 1;

                break;
                case Direction.LEFT:
                    updatedSegment.location.column -= 1;

                break;
                case Direction.UP:
                    updatedSegment.location.row -= 1;

                break;
                case Direction.DOWN:
                    updatedSegment.location.row += 1;
                
                break;
            }

            return updatedSegment;
        }));

        setWormLocation(newWormLocation);

        renderSandWormMovement(newWormLocation);

    }, [wormLocation, renderSandWormMovement, getRandomDirectionBasedOnMovement, wormPath, validateNextMove, getWormPathDirection, wormDirection]);

    const generateTileSkinGrid = useCallback(async(rows: number, columns: number) => {
        const gridArrayOfTileSkinString = Array.from({ length: rows }, () =>
            Array.from({ length: columns }, () => TileSkin.SAND));
    
        const gridSkinsArray = gridArrayOfTileSkinString.map((row, rowIndex) => {

            return row.map((column, columnIndex) => {

                if (!wormLocation) return TileSkin.SAND;

                // Check if the current tile is part of the worm
                const wormPart = wormLocation.find((segment): segment is WormSegment => {
                    const { location } = segment;

                    return location.row === rowIndex && location.column === columnIndex;
                });

                if (wormPart) {
                    // Return the corresponding worm part (head, body, or tail)
                    return wormPart.part;
                }

                //TODO: These should be randomly placed on the grid (not hardcoded)
                const foodLocations = [
                    { row: 3, col: 3 },
                    { row: 5, col: 7 },
                    { row: 8, col: 1 },
                    { row: 9, col: 9 },
                ];

                // Check if the current tile is a food position
                const foodLocationDetected = foodLocations.find((location) => {
                    return location.row === rowIndex && location.col === columnIndex;
                });

                if (foodLocationDetected) {
                    return TileSkin.FOOD;
                }

                return column;
            });
        });
        
        return gridSkinsArray;
     }, [wormLocation]);

    const initGameBoardGrid = useCallback(async(deviceType: Device) => {
        setDeviceType(deviceType);

        // gameboard tile state
        const tileSize: number = updateTileSize(deviceType);
        setTileSize(tileSize);
        setTotalTiles(getTotalTiles(deviceType)); 

        const rows = GameDimensions[deviceType].rows;
        const columns = GameDimensions[deviceType].columns;

        setRows(rows);
        setColumns(columns);

        const gridSkinsArray = await generateTileSkinGrid(rows, columns);

        setGrid(gridSkinsArray);

        let initialWormPath: Direction[] = [];

        for(let i = 0; i <= wormLength - 1; i++) {
            initialWormPath.push(Direction.RIGHT);
        }

        setWormPath(initialWormPath)

    }, [generateTileSkinGrid, wormLength]);

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
        if(tempGameOver) return; 

        const interval = setInterval(() => {
            // TODO: Check for collisions with walls, food, or itself

            // Update the grid with the new worm position
            moveSandWorm();

            // TODO: Update the game state (score, worm length, food eaten, etc.)

        }, 500);
    
        return () => clearInterval(interval);
    }, [moveSandWorm, tempGameOver]);
    
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