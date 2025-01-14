import React from 'react';
import {useState, useEffect, useRef, useCallback} from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import { GameTile } from '../../components/';
import { WindowSize, GameData, GameField, GameGrid, GameDimensions, Dimension, Device, Direction, NextMove, WormAnatomy, WormSegment, Tile, GroundTexture, GridCoordinates} from '../../library/definitions';
import { getDeviceType } from '../../library/utils';
import { createGameField, getTotalTiles, calculateTileSize, getRandomTileByType, addDropItemToBoard } from '../../library/gameGrid';
import { getNextMove, getOppositeDirection, getRandomizedNextMove } from '../../library/movement';
import { setupWormPath, extendWormPath, addNewDirectionToWormPath, getDirectionByWormPath } from '../../library/navigation';
import { validateNextMove, isBoundaryCollisionDetected } from '../../library/validation';
import { useGameContext } from '../../GameContext';

interface GameBoardProps {
    windowSize: WindowSize,
    gameData: GameData
}

function GameBoard({windowSize, gameData}: GameBoardProps) {
    const initialRef = useRef(true);

    const { wormLength, level, speed, score, maxActiveDrops, dropInventory, foodEaten, gameOver, gameWon, increaseFoodEaten, nextLevel } = useGameContext();

    const [deviceSize, setDeviceType] = useState<Device | null>(null);
    const [timer, setTimer] = useState<number>(0);

    const [gameField, setGameField] = useState<GameField>({tileGrid: [], boardSize: {rows: 0, columns: 0}});
    const [totalTiles, setTotalTiles] = useState<number>(0);
    const [tileSize, setTileSize] = useState<number>(0);

    const [sandWorm, setSandWorm] = useState<WormSegment[]>(gameData.sandWorm.segments);
    const [wormDirection, setWormDirection] = useState<Direction>(gameData.sandWorm.startDirection);
    const [wormPath, setWormPath] = useState<Direction[]>([]);
    const [activeDropCount, setActiveDropCount] = useState<number>(maxActiveDrops);

    const [inputDirection, setInputDirection] = useState<Direction | null>(null);

    const renderSandWormMovement = useCallback((newWormLocation: WormSegment[]) => {
         /*
            This function expects sandWorm to have updated segment locations 
            for each part (head/body/tail) of the Sandworm. Now we are updating the game board
            tiles with the new location of the Sandworm.
        */
       
        if (!gameField.tileGrid || gameField.tileGrid.length === 0 || !newWormLocation) return;

        let updatedGrid = [...gameField.tileGrid];

        newWormLocation.forEach((segment: WormSegment) => {  
            const { part, location } = segment;
            const { row, column } = location;

            if(!updatedGrid[row] || !updatedGrid[row][column]) {
                throw new Error('Cannot access grid coordinates.');
            }

            updatedGrid[row] = [...updatedGrid[row]];
            const prevTileData = updatedGrid[row][column];

            updatedGrid[row][column] = {
                ...prevTileData,
                type: part,
                data: segment
            }

            // reset old tail with sand texture to give sandworm the illusion of moving across sand.
            if (part === 'tail') {
                const tailDirection = wormPath[wormPath.length - 1];;

                switch (tailDirection) {
                    case Direction.RIGHT:
                        updatedGrid[row][column - 1].type = GroundTexture.SAND;
                        break;
                    case Direction.LEFT:
                        updatedGrid[row][column + 1].type = GroundTexture.SAND;
                        break;
                    case Direction.UP:
                        updatedGrid[row + 1][column].type = GroundTexture.SAND;
                        break;
                    case Direction.DOWN:
                        updatedGrid[row - 1][column].type = GroundTexture.SAND;
                        break;
                }
            }
        }); 

        setGameField((prevGameField) => ({...prevGameField, tileGrid: updatedGrid}));

    }, [gameField, wormPath]);

    const determineSandwormNextMove: () => NextMove = useCallback(() => {
        try{
            const headCoordinates: GridCoordinates = sandWorm[0].location;

            if(inputDirection) {
                const nextMove: NextMove = getNextMove(headCoordinates, inputDirection);

                if (validateNextMove(nextMove, gameField)){
                    return nextMove;
                }
            }

            const nextMoveByDefault: NextMove = getNextMove(headCoordinates, wormDirection);

            if (isBoundaryCollisionDetected(nextMoveByDefault, gameField)) {
                // Sandworm hit the boundary, move it in a random direction to keep things spicy!
                // TODO: increase difficulty as levels progress where hitting boundary means user loses the game
                return getRandomizedNextMove(gameField, headCoordinates, wormDirection);
            }

            return nextMoveByDefault;

        } catch (error) {
            throw new Error(`Error occurred setting sandworm direction: ${error}`);
        }
    }, [inputDirection, wormDirection, sandWorm, gameField]);

    const moveSandWorm = useCallback(async () => {
        if (!sandWorm || sandWorm.length === 0) {
            throw new Error('Worm location was not found');
        }

        let newSandwormLocation = [ ...sandWorm ]; 

        // Update the location of each segment based on the segment direction. 
        newSandwormLocation = await Promise.all(newSandwormLocation.map(async (segment) => {

            let updatedSegment: WormSegment = { ...segment };
            let newNextMove: NextMove;
            
            if (segment.part === WormAnatomy.HEAD) {
                newNextMove = determineSandwormNextMove();

                const {row, column}: GridCoordinates = newNextMove.coordinates;
                const nextTile: Tile = gameField.tileGrid[row][column];
                
                const isFoodEatenBySandworm: boolean = nextTile.type === GroundTexture.FOOD;

                if (isFoodEatenBySandworm) {
                    increaseFoodEaten();
                    setActiveDropCount((prevCount) => prevCount - 1);
                }

                setWormDirection(newNextMove.direction);
                setWormPath(addNewDirectionToWormPath(newNextMove.direction, wormPath));

            } else {
                // check the worm path for this segment's direction to modify it's location coordinates below.
                let segmentDirection: Direction = getDirectionByWormPath(wormPath, segment);
                newNextMove = getNextMove(segment.location, segmentDirection);
            }

            updatedSegment.location = {...newNextMove.coordinates}

            return updatedSegment;
        }));

        setSandWorm(newSandwormLocation);
        renderSandWormMovement(newSandwormLocation);
        setInputDirection(null);

    }, [gameField, sandWorm, wormPath, increaseFoodEaten, renderSandWormMovement, determineSandwormNextMove]);

    const addWormSegment = useCallback(async() => {
        let growSandWormData = [...sandWorm];
        const tailIndex: number = growSandWormData.length - 1;
        const newBody = {...growSandWormData[tailIndex]};
        newBody.part = WormAnatomy.BODY;

        growSandWormData.splice(tailIndex, 0, newBody);

        // update key and location for each sandworm segment
        growSandWormData = growSandWormData.map((segment, index) => {
            let newLocation: GridCoordinates = {...segment.location};

            if(segment.part === WormAnatomy.TAIL) {
                // to give the illusion the sandworm grew, update tail coordinate by locating the tile behind sandworm
                const oppositeDirection = getOppositeDirection(wormPath[wormLength - 2])
                const nextMove: NextMove = getNextMove(newLocation, oppositeDirection);
                newLocation = nextMove.coordinates;
            }   

            return {
                key: index,
                part: segment.part,
                location: {
                    ...newLocation
                }
            } as WormSegment
        });

        setSandWorm([...growSandWormData]);
    }, [sandWorm, wormPath, wormLength]);

    const initGameBoardGrid = useCallback(async(deviceType: Device) => {
        const gameDimensions: Dimension = {...GameDimensions[deviceType]}
        const gameboardField: GameField = await createGameField(gameDimensions, sandWorm, gameData.food);
        const tileSize: number = calculateTileSize(window, deviceType);
        const initialWormPath: Direction[] = setupWormPath(wormLength, wormDirection);

        setDeviceType(deviceType);
        setGameField(gameboardField);
        setTileSize(tileSize);
        setWormPath(initialWormPath)

        // To Be Removed -- For Dev Purposes Only -- 
        const totalTiles: number = getTotalTiles(gameDimensions);
        setTotalTiles(totalTiles); 

    }, [wormLength, wormDirection, sandWorm, gameData.food]);

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
        
    // Initialize Gameboard Component
    useEffect(() => {
        const initializeGame = async () => {

            const deviceType: Device = getDeviceType(windowSize);

            setDeviceType(deviceType);

            if (initialRef.current) {
                initialRef.current = false;

                await initGameBoardGrid(deviceType);
            }

            window.addEventListener('keydown', handleKeyDown);
            
            const handleResize = () => calculateTileSize(window, deviceType);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener("resize", handleResize);
            };
        }

        initializeGame();

    }, [windowSize, initGameBoardGrid]);

    // Sandworm Speed
    useEffect(() => {
        if(gameOver) return; 

        const interval = setInterval(() => {
            moveSandWorm();
            setTimer((prevTimer) => prevTimer + speed);

        }, speed);

    
        return () => clearInterval(interval);

    }, [moveSandWorm, gameOver, speed, timer]);

    useEffect(() => {
        if(deviceSize){
            setGameField((prevGameField) => ({...prevGameField, boardSize: GameDimensions[deviceSize] as Dimension}));
        }

    }, [deviceSize])

    useEffect(() => {
        if (sandWorm.length < wormLength) {
            const sandwormGrowsInLength = async() => {
                await addWormSegment();
            }

            sandwormGrowsInLength();
        }
       
    }, [wormLength, sandWorm, addWormSegment])

    useEffect(() => {
        if (gameField.tileGrid.length > 0 && dropInventory.food > 0 && activeDropCount < maxActiveDrops) {
            const dropIsAddedToBoard = () => {
                const randomValidSandTile: Tile = getRandomTileByType(gameField.tileGrid, GroundTexture.SAND);
                const updatedTileGrid: GameGrid = addDropItemToBoard(gameField, GroundTexture.FOOD, randomValidSandTile.data.location);

                setGameField((prevGameField) => ({...prevGameField, tileGrid: updatedTileGrid}));
                setActiveDropCount((prevCount) => prevCount + 1);
            };
        
            dropIsAddedToBoard();
        }
      }, [gameField, sandWorm, dropInventory.food, activeDropCount, maxActiveDrops]);

    useEffect(() => {
        if(gameField.tileGrid.length > 0 && dropInventory.food === 0 && activeDropCount === 0){
            nextLevel();
        }
    }, [activeDropCount, dropInventory.food, gameField.tileGrid.length, nextLevel]);

    useEffect(() => {
        if (wormPath.length > 0 && wormPath.length < sandWorm.length) {
            const newWormPath = extendWormPath(wormLength, wormPath);
            setWormPath(newWormPath);
        }
   
    }, [wormLength, wormPath, sandWorm]);

    return (
        <>
         <Box data-testid="game-board" >

            {deviceSize}: {totalTiles} tiles
            <Typography variant="body1">
                Total Rows: {gameField.boardSize?.rows} 
            </Typography>
            <Typography variant="body1">
                Total Columns: {gameField.boardSize?.columns}
            </Typography>
            <Typography variant="body1">
                Head Coordinate: {sandWorm[0]?.location.row}, {sandWorm[0]?.location.column}
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
                    <li>Drop Inventory: {dropInventory.food}</li>
                    <li>Active Drop Count: {activeDropCount}</li>
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
                    gridTemplateColumns: `repeat(${gameField.boardSize?.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${gameField.boardSize?.rows}, 1fr)`,
                  }}
            >
                {
                    gameField.tileGrid && gameField.tileGrid.map((row, rowIndex) => (
                        <Grid container direction="row" key={rowIndex} wrap="nowrap" className="m-auto">
                            {row.map((tile: Tile, columnIndex: number) => (
                                <GameTile 
                                    key={columnIndex}
                                    tile={tile}    
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