import { Direction, WormAnatomy } from './definitions';
import { extendWormPath, setupWormPath, getDirectionByWormPath, addNewDirectionToWormPath } from './navigation';

describe('setupWormPath Navigation Function', () => {
    it('returns a worm path based on starting direction', () => {
        const wormLength = 4;
        const direction = Direction.RIGHT;
        const assertWormPath = [Direction.RIGHT, Direction.RIGHT, Direction.RIGHT, Direction.RIGHT];
        const initialWormPath = setupWormPath(wormLength, direction);
        
        expect(initialWormPath.length).toEqual(wormLength);
        expect(initialWormPath).toEqual(assertWormPath);
        expect(initialWormPath).not.toEqual([Direction.UP, Direction.RIGHT]);
    });

    describe('error handling', () => {
        const errorMessage = "Issue occurred while setting up worm path. Invalid worm length or worm direction.";

        it('throws error when worm length is invalid', () => {
            expect(() => setupWormPath(null, Direction.UP)).toThrow(errorMessage);
            expect(() => setupWormPath(0, Direction.UP)).toThrow(errorMessage);
        });

        it('throws error when direction is invalid', () => {
            expect(() => setupWormPath(4, null)).toThrow(errorMessage);
        });
    });
});

describe('getDirectionByWormPath Navigation Function', () => {
    describe('gets worm path direction for worm segment when arguments are valid', () => {

        it('references direction from worm path for head segment', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, headSegment)).toEqual(Direction.UP);
        });
    
        it('references direction from worm path for body segment', () => {
            const bodySegment = {
                key: 1,
                part: WormAnatomy.BODY,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, bodySegment)).toEqual(Direction.RIGHT);
        });
    
        it('references direction from worm path for second body segment', () => {
            const bodySegment = {
                key: 2,
                part: WormAnatomy.BODY,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, bodySegment)).toEqual(Direction.LEFT);
        });

        it('references direction from worm path for tail segment', () => {
            const tailSegment = {
                key: 3,
                part: WormAnatomy.TAIL,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];

            expect(getDirectionByWormPath(wormPath, tailSegment)).toEqual(Direction.DOWN);
        });
    });

    describe('error handling when arguments are invalid', () => {
        const errorMessage = 'Error occurred getting direction from worm path. Invalid worm path or segment.';

        it('throws error when worm path is null', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };

            expect(() => getDirectionByWormPath(null, headSegment)).toThrow(errorMessage);
        });

        it('throws error when worm path length is zero', () => {
            const headSegment = {
                key: 0,
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };

            expect(() => getDirectionByWormPath([], headSegment)).toThrow(errorMessage);
        });

        it('throws error when segment is invalid', () => {
            const wormPath = [Direction.UP, Direction.UP, Direction.UP, Direction.UP];
            expect(() => getDirectionByWormPath(wormPath, null)).toThrow(errorMessage);
        });

        it('throws error when segment key is missing', () => {
            const headSegment = {
                part: WormAnatomy.HEAD,
                location: {
                    row: 10, 
                    column: 11,
                }
            };
            const wormPath = [Direction.UP, Direction.UP, Direction.UP, Direction.UP];
            expect(() => getDirectionByWormPath(wormPath, headSegment)).toThrow(errorMessage);
        });

    });
});

describe('addNewDirectionToWormPath Navigation Function', () => {
    it('adds new direction to worm path when arguments', () => {
        const currentWormPath = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
        const assertWormPath = [Direction.RIGHT, Direction.UP, Direction.RIGHT, Direction.DOWN];
        const updatedWormPath = addNewDirectionToWormPath(Direction.RIGHT, currentWormPath);

        expect(updatedWormPath).toEqual(assertWormPath);
        expect(updatedWormPath.length).toEqual(4);
    });

    it('throws error when direction or worm path is invalid', () => {
        const newDirection = Direction.UP;
        const wormPath = [Direction.RIGHT, Direction.UP, Direction.RIGHT, Direction.DOWN];
        const errorMessage = 'Issue occurred when adding new direction to worm path. Invalid direction or worm path.';

        expect(() => addNewDirectionToWormPath(null, wormPath)).toThrow(errorMessage);
        expect(() => addNewDirectionToWormPath(newDirection, null)).toThrow(errorMessage);
    });
});

describe('extendWormPath Navigation Function', () => {
    it('returns an updated worm path when arguments are valid', () => {
        const newWormLength = 5;
        const originalWormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];
        const extendedWormPath = extendWormPath(newWormLength, originalWormPath);

        expect(extendedWormPath.length).toEqual(newWormLength);
        expect(extendedWormPath).toEqual([...originalWormPath, Direction.DOWN]);
        expect(extendedWormPath).not.toEqual([...originalWormPath, Direction.LEFT]);
    });

    describe('error handing', () => {
        const errorMessage = "Issued occurred updating worm path. Invalid worm length or worm path.";
        const wormPath = [Direction.UP, Direction.RIGHT, Direction.LEFT, Direction.DOWN];
        const wormLength = 4;

        it('throws error when worm length is null', () => {
            expect(() => extendWormPath(null, wormPath)).toThrow(errorMessage);
        });

        it('throws error when worm length is zero', () => {
            expect(() => extendWormPath(null, wormPath)).toThrow(errorMessage);
        });

        it('throws error when worm path is null', () => {
            expect(() => extendWormPath(wormLength, null)).toThrow(errorMessage);
        });

        it('throws error when worm path length is zero', () => {
            expect(() => extendWormPath(wormLength, 0)).toThrow(errorMessage);
        });
    });
});