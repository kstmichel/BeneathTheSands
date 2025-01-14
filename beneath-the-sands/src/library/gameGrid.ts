import { Device, GameDimensions, Dimension, GameField, GameGrid, Direction, Tile, TileType, NextMove, GroundTexture, GridCoordinates, WormAnatomy, WormSegment, Food } from './definitions';
import { getOppositeDirection, getNextMove } from './movement';

export const getGridArray = (dimensions: Dimension): GameGrid => {
    if(!dimensions.rows || dimensions.rows === 0 || !dimensions.columns || dimensions.columns === 0 ) {
        throw new Error('Invalid grid dimensions or tile size.');
    }

    return(
        Array.from({ length: dimensions.rows }, (k, r) =>
            Array.from({ length: dimensions.columns }, (k, c) => (createNewTile(GroundTexture.SAND, {row: r, column: c})))
        )
    )
};

export const createGameField = (boardDimensions: Dimension, sandworm: WormSegment[], food: Food[] ): Promise<GameField> => {
    if(!boardDimensions || !boardDimensions.rows || boardDimensions.rows === 0 || !boardDimensions.columns || boardDimensions.columns === 0) {
        throw new Error('Issue occurred while creating the game board. Invalid board dimensions.');
    }

    if(!sandworm || !food) throw new Error('Issue occurred while creating the game board. Invalid sandworm, or food locations.')

    const gameDimensions: Dimension = {...boardDimensions};
    let gameboardGrid: GameGrid = getGridArray(gameDimensions);

    sandworm.forEach((segment) => {
        const {row, column} = segment.location;
        let segmentTile: Tile = createNewTile(segment.part, segment.location);
        segmentTile = {
            ...segmentTile,
            data: {
                ...segmentTile.data,
                key: segment.key,
            } as WormSegment
        };
        
        gameboardGrid[row][column] = segmentTile;
    });

    food.forEach((foodItem: Food) => {
        const {row, column} = foodItem.location;
        gameboardGrid[row][column] = createNewTile(GroundTexture.FOOD, foodItem.location);
    });

    return Promise.resolve({tileGrid: gameboardGrid, boardSize: boardDimensions} as GameField);
 };

export const calculateTileSize = (window: Window, deviceType: Device): number => {
    if(!window || !deviceType) throw new Error('Issue occurred during tile size calculation. Invalid window or device.');
    
    const containerWidth = window.innerWidth * 0.9;
    const containerHeight = window.innerHeight * 0.9;

    // Calculate the maximum possible size for a square tile
    const size: number = Math.min(
        containerWidth / GameDimensions[deviceType].columns,
        containerHeight / GameDimensions[deviceType].rows
    );

    return size;
};

export const getTotalTiles = (dimensions: Dimension): number => {
    if(!dimensions) throw new Error('Cannot calculate total tiles. Missing dimensions.');

    return dimensions.rows * dimensions.columns;
}

export const getRandomTileByType = (board: GameGrid, newTileType: TileType): Tile => {
    if(!board || !newTileType) throw new Error('Issue occured getting random tile by tile type. Invalid game grid or tile type.');

    const tilesMatchingDesiredType: Tile[] = board.flat().filter(tile => tile.type === newTileType);

    if (tilesMatchingDesiredType.length === 0) {
        // No matching tiles found
        throw new Error(`Could not find random tile with tile type ${newTileType}`)
    }

    // Select a random tile from the filtered array
    const randomIndex = Math.floor(Math.random() * tilesMatchingDesiredType.length);
    return tilesMatchingDesiredType[randomIndex];
};

export const createNewTile = (tileType: TileType, coordinates: GridCoordinates): Tile => {
    if(!tileType || !coordinates) throw new Error('Issue occurred creating a new tile. Invalid tile type or coordinates.');

    const newTile: Tile = {
        type: tileType, 
        data: {
            location: coordinates
        }
    }

    return newTile;
};

export const addDropItemToBoard = (gameField: GameField, dropType: TileType, coordinates: GridCoordinates): GameGrid => {
    if(!gameField || !dropType || !coordinates) throw new Error('Issue occurred while dropping item to gameboard. Invalid gameField or random tile.')
    
    const {row, column} = coordinates;
    const tile: Tile = createNewTile(dropType, coordinates);

    let updateGameRow: Tile[] = [...gameField.tileGrid[row]];
    updateGameRow[column] = tile;

    let updateTileGrid: GameGrid = [...gameField.tileGrid];
    updateTileGrid[row] = [...updateGameRow];

    return updateTileGrid;
};

export const addWormSegment = (sandWorm: WormSegment[], wormPath: Direction[]): WormSegment[] => {
    if(!sandWorm || sandWorm.length === 0 || !wormPath || wormPath.length === 0) throw new Error('Unable to add worm segment. Invalid sandworm location, worm length, or worm path.')
    
    let growSandWormData: WormSegment[]= [...sandWorm];
    const tailIndex: number = growSandWormData.length - 1;
    const newBody = {...growSandWormData[tailIndex]};

    newBody.part = WormAnatomy.BODY;

    growSandWormData.splice(tailIndex, 0, newBody);

    // update key and location for each sandworm segment
    growSandWormData = growSandWormData.map((segment, index) => {
        let newLocation: GridCoordinates = {...segment.location};

        if (segment.part === WormAnatomy.TAIL) {
            // to give the illusion the sandworm grew, update tail coordinate by locating the tile behind sandworm
            const oppositeDirection = getOppositeDirection(wormPath[tailIndex])
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

    return [...growSandWormData];
};