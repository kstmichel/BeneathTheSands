import {Device, GameDimensions, Dimension, GameField, GameGrid, Tile, TileType, GroundTexture, GridCoordinates} from './definitions';


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

    const {row, column}: GridCoordinates = coordinates;

    const newTile: Tile = {
        type: tileType, 
        data: {
            location: {
                row: row, 
                column: column
            }
        }
    }

    return newTile;
};

export const addDropItemToBoard = (gameField: GameField, randomTile: Tile): GameGrid => {
    const {row, column} = randomTile.data.location;

    // TODO: Add logic to randomize what is going to drop (food, ruby, coin, blackhole)
    const tile: Tile = createNewTile(GroundTexture.FOOD, randomTile.data.location);

    let updateGameRow: Tile[] = [...gameField.tileGrid[row]];
    updateGameRow[column] = tile;

    let updateTileGrid: GameGrid = [...gameField.tileGrid];
    updateTileGrid[row] = [...updateGameRow];

    return updateTileGrid;
};
