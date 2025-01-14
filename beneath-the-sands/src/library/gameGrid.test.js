import "@testing-library/jest-dom"; // Ensure this import is present
import { Device, GroundTexture, WormAnatomy } from './definitions';
import { 
    getGridArray, 
    createGameField,
    calculateTileSize,
    getTotalTiles,
    getRandomTileByType,
    createNewTile,
    addDropItemToBoard
} from './gameGrid';

describe('getGridArray Gameboard Function', () => {
    it('returns a grid array when parameters are not null', () => {
        const assertTotalTiles = 150;
        const gridArray = getGridArray({rows: 15, columns: 10});

        expect(gridArray).toBeDefined();
        expect(gridArray.length * gridArray[0].length).toEqual(assertTotalTiles);
    });

    describe('error handling', () => {
        const errorMessage = 'Invalid grid dimensions or tile size.';

        it('throws an error when rows is zero', () => {
            expect(() => getGridArray({rows: 0, columns: 10})).toThrow(errorMessage);
        });
    
        it('throws an error when columns is zero', () => {
            expect(() => getGridArray({rows: 10, columns: 0})).toThrow(errorMessage);
        });
    
        it('throws an error when rows is null', () => {
            expect(() => getGridArray({rows: null, columns: 10})).toThrow(errorMessage);
        });
    
        it('throws an error when columns is null', () => {
            expect(() => getGridArray({rows: 10, columns: null})).toThrow(errorMessage);
        });
    });
});      

describe('createGameBoard Gameboard Function', () => {
    it('should correctly initialize the game board with sandworm and food locations', async() => {
        const boardDimensions = {rows: 20, columns: 15};
        const wormLocation = [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ];
          
        const foodLocations = [
            { variant: 'soulFood', location: {row: 3, column: 3 }},
            { variant: 'soulFood', location: {row: 5, column: 5 }},
            { variant: 'soulFood', location: {row: 2, column: 7 }},
            { variant: 'soulFood', location: {row: 9, column: 9 }}
        ];

        const {tileGrid, boardSize} = await createGameField(boardDimensions, wormLocation, foodLocations);
        
        wormLocation.forEach((segment) => {
            const {row, column} = segment.location;
            const gameTile = tileGrid[row][column];
            expect(gameTile.type).toEqual(segment.part);
        })

        foodLocations.forEach((food) => {
            const {row, column} = food.location;
            const gameTile = tileGrid[row][column];
            expect(gameTile.type).toEqual(GroundTexture.FOOD);
        })
          
        const assertSand = {row: 1, column: 2};
        const {row, column} = assertSand;

        expect(tileGrid[row][column].type).toEqual(GroundTexture.SAND);
        expect(tileGrid).toBeDefined();
        expect(boardSize).toBeDefined();
    });

    describe('error handling', () => {
        const errorMissingDimensionsMessage = "Issue occurred while creating the game board. Invalid board dimensions.";
        const errorMissingWormLocationOrFoodMessage = "Issue occurred while creating the game board. Invalid sandworm, or food locations."
        const boardDimensions = {rows: 20, columns: 15};
        const wormLocation = [
            { key: 0, part: WormAnatomy.HEAD, location: { row: 7, column: 10 } },
            { key: 1, part: WormAnatomy.BODY, location: { row: 7, column: 9 } },
            { key: 2, part: WormAnatomy.BODY, location: { row: 7, column: 8 } },
            { key: 3, part: WormAnatomy.TAIL, location: { row: 7, column: 7 } },
          ];
          
          const foodLocations = [
            { key: 1, variant: 'soulFood', location: {row: 3, column: 3 }},
            { key: 1, variant: 'soulFood', location: {row: 5, column: 5 }},
            { key: 1, variant: 'soulFood', location: {row: 7, column: 7 }},
            { key: 1, variant: 'soulFood', location: {row: 9, column: 9 }}
          ];

        it('throws error when board dimensions are missing', () => {
            expect(() => createGameField(null, wormLocation, foodLocations)).toThrow(errorMissingDimensionsMessage);
        });

        it('throws error when sandworm location is missing', () => {
            expect(() => createGameField(boardDimensions, null, foodLocations)).toThrow(errorMissingWormLocationOrFoodMessage);
        });

        it('throws error when food locations are missing', () => {
            expect(() => createGameField(boardDimensions, wormLocation, null)).toThrow(errorMissingWormLocationOrFoodMessage);
        });
    })
});

describe('calculateTileSize Gameboard Function', () => {
    it('returns tile size based on window dimension and device', () => {
        expect(calculateTileSize({innerWidth: 1400, innerHeight: 900}, Device.Desktop)).toEqual(42);
        expect(calculateTileSize({innerWidth: 800, innerHeight: 900}, Device.Tablet)).toEqual(36);
        expect(calculateTileSize({innerWidth: 600, innerHeight: 700}, Device.Mobile)).toEqual(36);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred during tile size calculation. Invalid window or device.";
        it('throws an error when window is null', () => {
            expect(() => calculateTileSize(null, Device.Mobile)).toThrow(errorMessage);
        });

        it('throws an error when device type is null', () => {
            expect(() => calculateTileSize({ innerWidth: 300, innerHeight: 900 }, null)).toThrow(errorMessage);
        });
    })
});

describe('getTotalTiles Gameboard Function', () => {
    it('calculates total number of tiles from board size', () => {
        expect(getTotalTiles({rows: 10, columns: 10})).toEqual(100);
        expect(getTotalTiles({rows: 10, columns: 15})).toEqual(150);
    })

    it('throws error when dimensions argument is missing', () => {
        expect(() => getTotalTiles(null)).toThrow('Cannot calculate total tiles. Missing dimensions.');
    });
});

describe('getRandomTileByType Gameboard Function', () => {
    it('returns a random tile based on the desired tile type (SAND)', () => {
        const gameBoardArray = getGridArray({rows: 15, columns: 10});
        const randomTile = getRandomTileByType(gameBoardArray, GroundTexture.SAND);
        const {row, column} = randomTile.data.location;
        const assertBoundary = row >= 0 && row <= 15 && column >= 0 && column <= 10; 

        expect(randomTile.type).toEqual(GroundTexture.SAND);
        expect(assertBoundary).toBeTruthy();
    });

    describe('error handling', () => {
        const errorMessage = "Issue occured getting random tile by tile type. Invalid game grid or tile type.";
       
        it('throws error when game grid is missing', () => {
            expect(() => getRandomTileByType(null, GroundTexture.SAND)).toThrow(errorMessage);
        });
     
        it('throws error when tile type is missing', () => {
            const gameBoardArray = getGridArray({rows: 8, columns: 8});

            expect(() => getRandomTileByType(gameBoardArray, null)).toThrow(errorMessage);
        });
    })
});

describe('createNewTile Gameboard Function', () => {
    it('creates and returns a new tile', () => {
        const newTile = createNewTile(GroundTexture.FOOD, {row: 10, column: 7});
        const {row, column} = newTile.data.location;
        const assertCorrectCoordinates = row === 10 && column === 7; 

        expect(newTile.type).toEqual(GroundTexture.FOOD);
        expect(assertCorrectCoordinates).toBeTruthy();
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred creating a new tile. Invalid tile type or coordinates.";
       
        it('throws error when tile type is missing', () => {
            expect(() => createNewTile(null, {row: 12, column: 20})).toThrow(errorMessage);
        });
     
        it('throws error when coordinates are missing', () => {
            expect(() => createNewTile(GroundTexture.SAND, null)).toThrow(errorMessage);
        });
    })

});

describe('addDropItemToBoard Gameboard Function', () => {
    it('adds a drop item to the gameboard', () => {

        const boardDimensions = {rows: 15, columns: 30};
        const assertCoordinates = {row: 10, column: 7};
        const {row, column} = assertCoordinates;
        const assertTileType = GroundTexture.FOOD;

        const gameGrid = getGridArray(boardDimensions);
        const gameField = {tileGrid: gameGrid, boardSize: boardDimensions};
        const updatedGameGrid = addDropItemToBoard(gameField, assertTileType, assertCoordinates);

        expect(updatedGameGrid[row][column].type).toEqual(assertTileType);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred while dropping item to gameboard. Invalid gameField or random tile.";
       
        it('throws error when game field is missing', () => {
            expect(() => addDropItemToBoard(null, GroundTexture.FOOD, {row: 12, column: 20})).toThrow(errorMessage);
        });
     
        it('throws error when drop/tile type is missing', () => {
            const boardDimensions = {rows: 15, columns: 30};
            const gameGrid = getGridArray(boardDimensions);
            const gameField = {tileGrid: gameGrid, boardSize: boardDimensions};

            expect(() => addDropItemToBoard(gameField, null, {row: 12, column: 20})).toThrow(errorMessage);
        });
     
        it('throws error when coordinates are missing', () => {
            const boardDimensions = {rows: 15, columns: 30};
            const gameGrid = getGridArray(boardDimensions);
            const gameField = {tileGrid: gameGrid, boardSize: boardDimensions};

            expect(() => addDropItemToBoard(gameField, GroundTexture.SAND, null)).toThrow(errorMessage);
        });
    })
});