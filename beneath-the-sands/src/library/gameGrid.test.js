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
 //TODO
});

describe('createNewTile Gameboard Function', () => {
//TODO
});

describe('addDropItemToBoard Gameboard Function', () => {
//TODO
});