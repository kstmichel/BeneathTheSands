import React from 'react';
import {useState, useEffect, useRef, useCallback} from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { GameTile } from '../../components/';
import { GameDimensions, Device, Direction, WormAnatomy, WormSegment, TileTexture, GridCoordinates} from '../../library/definitions';
import { getTotalTiles, getLastItem, getRandomizedDirectionOptions } from '../../library/utils';
import { useGameContext } from '../../GameContext';

interface GameBoardProps {
    windowSize: {
        width: number;
        height: number;
    },
    gameData: {
        sandWorm: WormSegment[],
        food: GridCoordinates[],
        startDirection: Direction,
    }
}

function GameBoard({windowSize, gameData}: GameBoardProps) {
    const initialRef = useRef(true);

    const { level, speed, wormLength, score, foodEaten, gameOver, gameWon, increaseSpeed } = useGameContext();

    const isMobile = windowSize.width <= 768;
    const isTablet = windowSize.width <= 1024;

    const [deviceSize, setDeviceType] = useState<Device | null>(null); //TODO: Can be removed after development
    const [timer, setTimer] = useState<number>(0);

    const [totalTiles, setTotalTiles] = useState<number>(0);
    const [tileSize, setTileSize] = useState(20);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [totalColumns, setTotalColumns] = useState<number>(0);
    const [grid, setGrid] = useState<string[][]>([]);
    const [wormDirection, setWormDirection] = useState<Direction>(gameData.startDirection);
    const [sandWorm, setSandWorm] = useState<WormSegment[]>(gameData.sandWorm);
    const [food, setFood] = useState<GridCoordinates[]>(gameData.food);
    const [wormPath, setWormPath] = useState<Direction[]>([]);
    const [inputDirection, setInputDirection] = useState<Direction | null>(null);
    const [tempGameOver, setTempGameOver] = useState<boolean>(false);

    const isBoundaryCollisionDetected = useCallback((coordinates?: GridCoordinates): boolean => {
        const { row, column }: GridCoordinates = coordinates || sandWorm[0].location;
        const yBoundaryCollision: boolean = row < 0 || row > (totalRows - 1);
        const xBoundaryCollision: boolean = column < 0 || column > (totalColumns - 1);

        return yBoundaryCollision || xBoundaryCollision;

    }, [totalRows, totalColumns, sandWorm]);

    const renderSandWormMovement = useCallback((newWormLocation: WormSegment[]) => {
         /*
            This function expects sandWorm to have updated segment locations 
            for each part (head/body/tail) of the Sandworm. Now we are updating the game board
            tiles with the new location of the Sandworm.
        */
       
        if (!grid || grid.length === 0 || !newWormLocation) return;

        let updatedGrid = [...grid];

        newWormLocation.forEach((segment: WormSegment) => {  
            const { part, location } = segment;
            const { row, column } = location;

            if(isBoundaryCollisionDetected()) {
                throw new Error(`sandworm has broken out of the boundary: ${row} ${column} ${part}`);
            }

            updatedGrid[row] = [...updatedGrid[row]];
            updatedGrid[row][column] = part;
            
            // reset old tail with sand texture to give sandworm the illusion of moving across sand.
            if (part === 'tail') {
                const tailDirection = getLastItem(wormPath);

                switch (tailDirection) {
                    case Direction.RIGHT:
                        updatedGrid[row][column - 1] = TileTexture.SAND;
                        break;
                    case Direction.LEFT:
                        updatedGrid[row][column + 1] = TileTexture.SAND;
                        break;
                    case Direction.UP:
                        updatedGrid[row + 1][column] = TileTexture.SAND;
                        break;
                    case Direction.DOWN:
                        updatedGrid[row - 1][column] = TileTexture.SAND;
                        break;
                }
            }
        }); 

        setGrid(updatedGrid);

    }, [grid, wormPath, isBoundaryCollisionDetected]);

    const nextMoveCoordinates = useCallback((direction: Direction) => {
        const wormHead: WormSegment = sandWorm[0]; 
        let nextLocation: GridCoordinates = {...wormHead.location};

        switch (direction) {
            case Direction.RIGHT:
                nextLocation.column += 1
                break;
            case Direction.LEFT:
                nextLocation.column -= 1
                break;
            case Direction.UP:
                nextLocation.row -= 1

                break;
            case Direction.DOWN:
                nextLocation.row += 1

                break;
        }

        return nextLocation;

    }, [sandWorm]);

    const getTileTextureByCoordinate = (coordinates: GridCoordinates): TileTexture => {
        const {row, column} = coordinates;
        const tileByCoordinates = document.getElementById(`tile-${row}-${column}`);
        let tileTextureByClass: TileTexture = TileTexture.SAND;

        for (const texture in TileTexture) {
            const tileTexture = texture.toLowerCase();
            if (tileByCoordinates?.classList.contains(`tile-texture--${tileTexture}`)) {
                tileTextureByClass = TileTexture[texture as keyof typeof TileTexture];
                break;
            }
        }

        return tileTextureByClass;
    };

    const isOppositeDirection = useCallback((direction: Direction): boolean => {
        if(!direction) throw new Error('Cannot detect opposite direction used.');
    
        const nextMove: GridCoordinates = nextMoveCoordinates(direction);
        const tileType = getTileTextureByCoordinate(nextMove);

        return tileType === "body";
    }, [nextMoveCoordinates]);
 
    const getValidRandomDirection = useCallback((): Direction => {
        // set directional options
        const directionalOptions: Direction[] = wormDirection === Direction.RIGHT || wormDirection === Direction.LEFT
            ? [Direction.UP, Direction.DOWN]
            : [Direction.LEFT, Direction.RIGHT];

        const randomizedOptions: Direction[] = getRandomizedDirectionOptions(directionalOptions);

        const validDirections = randomizedOptions.filter((randomDirection: Direction) => {
            const nextMove: GridCoordinates = nextMoveCoordinates(randomDirection);
            return !isBoundaryCollisionDetected(nextMove); 
        });

        if(validDirections.length === 0) {
            throw new Error(`No safe directions were found: options: ${randomizedOptions}`);
        }
        
        return validDirections[0]; // return first valid direction

    }, [wormDirection, nextMoveCoordinates, isBoundaryCollisionDetected]);

    const getDirectionByWormPath = useCallback((path: Direction[], segment: WormSegment): Direction => {
        if(!path || path.length === 0) throw new Error('Worm path is null or empty.');

        return path[segment.key];
    }, []);

    const validateInputDirection = useCallback((inputDirection: Direction | null) => {
        if(!inputDirection) throw new Error('failed to validate input direction');

        let isValid: boolean = true;

        try {
            // run validation functions
            const runValidationChecks = async () => {
                const moveInOppositeDirection: boolean = isOppositeDirection(inputDirection);

                if (moveInOppositeDirection) {
                    isValid = false;
                    return; // no need to keep validating
                }
        
                const nextMove: GridCoordinates = nextMoveCoordinates(inputDirection);
                const moveCollidesWithBoundary: boolean = isBoundaryCollisionDetected(nextMove);
             
                if (moveCollidesWithBoundary){
                    isValid = false;
                }
            }

           runValidationChecks();

        } catch {
            throw new Error('input validation error occurred');
        }

        return isValid;

    }, [isOppositeDirection, nextMoveCoordinates, isBoundaryCollisionDetected]);

    const determineSandwormDirection = useCallback(() => {
        /*
            HEAD DIRECTIVE: Check to see if any input was detected and if so validate the input.
                Invalid input: Ignore move request and continue in the current direction.
                    1) Move in the opposite direction  2) Move into the boundary wall
                Valid input: Update the current direction to the input direction.
        */
        
        try{
            let headDirection = wormDirection; // default to worm's current direction
            let nextMoveIsValidated: boolean = false;

            // Check to see if any user input was detected with arrow keys.
            if(inputDirection) {
                 // Validate the input and set direction if valid, otherwise default to the current direction;
                const isValidInputDirection: boolean = validateInputDirection(inputDirection);

                if (isValidInputDirection){
                    headDirection = inputDirection;
                    nextMoveIsValidated = true;
                }
            }

            // if next move hasn't been validated yet, check for a boundary collision
            if (!nextMoveIsValidated) {  
                const nextMove: GridCoordinates = nextMoveCoordinates(headDirection);

                if (isBoundaryCollisionDetected(nextMove)) {
                    // oops the sandworm hit the boundary, move it in a random direction to keep things spicy!
                    headDirection = getValidRandomDirection(); 
                }
            }

            return headDirection;

        } catch (error) {
            throw new Error(`Error occurred setting sandworm direction: ${error}`);
        }
    }, [getValidRandomDirection, inputDirection, isBoundaryCollisionDetected, nextMoveCoordinates, validateInputDirection, wormDirection]);

    const applyWormPathChange = useCallback((direction: Direction) => {
        /*  
            Each item in the array represents a segment of the Sandworm ([H, B, B, T]), 
            and the values are the direction in which that segment must move. 

            Example Worm Path: [UP, RIGHT, RIGHT, DOWN]

            The Worm path is updated with new HEAD direction inserted at beginning of array,
            and last item in array is removed to record the sandworm path and move in a worm-like fashion.
        */

        let updatedWormPath = wormPath;

        updatedWormPath.unshift(direction);
        updatedWormPath.pop();

        return updatedWormPath;
    }, [wormPath]);

    const moveSandWorm = useCallback(async () => {
        if (!sandWorm) {
            throw new Error('Worm location was not found');
        }

        let newSandwormLocation = [ ...sandWorm ]; 

        // Update the location of each segment based on the segment direction. 
        newSandwormLocation = await Promise.all(newSandwormLocation.map(async (segment) => {

            let updatedSegment: WormSegment = { ...segment };
            let segmentDirection: Direction;

            if (segment.part === WormAnatomy.HEAD) {
                segmentDirection = determineSandwormDirection();
                setWormDirection(segmentDirection);

                const updatedWormPath = applyWormPathChange(segmentDirection);
                setWormPath(updatedWormPath);

            } else {
                // check the worm path for this segment's direction to modify it's location coordinates below.
                segmentDirection = getDirectionByWormPath(wormPath, segment);
            }

            // update segment location
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

        setSandWorm(newSandwormLocation);
        renderSandWormMovement(newSandwormLocation);
        setInputDirection(null); //reset input directions

    }, [sandWorm, renderSandWormMovement, wormPath, getDirectionByWormPath, determineSandwormDirection, applyWormPathChange]);

    const generateTileTextureGrid = useCallback(async(rows: number, columns: number) => {
        let desertTextureGrid = Array.from({ length: rows }, () =>
            Array.from({ length: columns }, () => TileTexture.SAND));
    
        const desertWithGameAssets = desertTextureGrid.map((row, rowIndex) => {

            return row.map((column, columnIndex) => {

                if (!sandWorm) return TileTexture.SAND;

                // Check if the current tile is part of the worm
                const wormPart = sandWorm.find((segment): segment is WormSegment => {
                    const { location } = segment;

                    return location.row === rowIndex && location.column === columnIndex;
                });

                if (wormPart) {
                    // Return the corresponding worm part (head, body, or tail)
                    return wormPart.part;
                }

                //TODO: These should be randomly placed on the grid (not hardcoded)
                // const foodLocations = [
                //     { row: 3, col: 3 },
                //     { row: 5, col: 7 },
                //     { row: 8, col: 1 },
                //     { row: 9, col: 9 },
                // ];

                // Check if the current tile is a food position
                const foodLocationDetected = food.find((location) => {
                    return location.row === rowIndex && location.column === columnIndex;
                });

                if (foodLocationDetected) {
                    return TileTexture.FOOD;
                }

                return column;
            });
        });
        
        return desertWithGameAssets;
     }, [sandWorm, food]);

    const initGameBoardGrid = useCallback(async(deviceType: Device) => {
        setDeviceType(deviceType);

        // gameboard tile state
        const tileSize: number = updateTileSize(deviceType);
        setTileSize(tileSize);
        setTotalTiles(getTotalTiles(deviceType)); 

        const rows = GameDimensions[deviceType].rows;
        const columns = GameDimensions[deviceType].columns;

        setTotalRows(rows);
        setTotalColumns(columns);

        const gridTexture = await generateTileTextureGrid(rows, columns);

        setGrid(gridTexture);

        let initialWormPath: Direction[] = [];

        for(let i = 0; i <= wormLength - 1; i++) {
            initialWormPath.push(Direction.RIGHT);
        }

        setWormPath(initialWormPath)

    }, [generateTileTextureGrid, wormLength]);

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

    // Add listener for Arrow keys input
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                setInputDirection(Direction.UP);
                break;
            case 'ArrowDown':
                setInputDirection(Direction.DOWN);
                break;
            case 'ArrowLeft':
                setInputDirection(Direction.LEFT);
                break;
            case 'ArrowRight':
                setInputDirection(Direction.RIGHT);
                break;
        }
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

            window.addEventListener('keydown', handleKeyDown);
            
            // Update size on window resize
            const handleResize = () => updateTileSize(deviceType);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener("resize", handleResize);
            };
        }

        initializeGame();

    }, [isMobile, isTablet, initGameBoardGrid]);

    useEffect(() => {
        if(tempGameOver) return; 

        const interval = setInterval(() => {
            // TODO: Check for collisions with walls, food, or itself

            // Update the grid with the new worm position
            moveSandWorm();
            setTimer((prevTimer) => prevTimer + speed);

            // TODO: Update the game state (score, worm length, food eaten, etc.)

        }, speed);

    
        return () => clearInterval(interval);

    }, [moveSandWorm, tempGameOver, speed, timer]);

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
            <Typography variant="body1">
                Total Rows: {totalRows} 
            </Typography>
            <Typography variant="body1">
                Total Columns: {totalColumns}
            </Typography>
            <Typography variant="body1">
                Head Coordinate: {sandWorm[0].location.row}, {sandWorm[0].location.column}
            </Typography>
            <Typography variant="body1">
                Timer: {timer}
            </Typography>

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
                    gridTemplateColumns: `repeat(${totalRows}, 1fr)`,
                    gridTemplateRows: `repeat(${totalColumns}, 1fr)`,
                  }}
            >
                {
                    grid && grid.map((row, rowIndex) => (
                        <Grid container direction="row" key={rowIndex} wrap="nowrap" className="m-auto">
                            {row.map((tile, columnIndex) => (
                                <GameTile 
                                    key={columnIndex}
                                    texture={tile as TileTexture} 
                                    size={tileSize}         
                                    coordinate={{row: rowIndex, column: columnIndex}}
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