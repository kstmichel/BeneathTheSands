import "@testing-library/jest-dom"; // Ensure this import is present
import { Device } from './definitions';
import { 
    getGridArray, 
    calculateTileSize,
    getTotalTiles
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