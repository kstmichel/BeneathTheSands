import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this import is present
import GameTile from './';
import { GroundTexture, WormAnatomy} from '../../library/definitions';

afterEach(cleanup);

const GameTilePropTest = {
    tile: {
        type: GroundTexture.SAND,
        size: 35, 
        data: {
            key: 1,
            location: {
                row: 1,
                column: 1
            }
        },
    },
    children: null, 
    onCollision: () => {console.log('test')}
}

describe('GameTile component renders correctly', () => {

    it('renders with sand texture', () => {
        const GameTilePropSandTest = {
            ...GameTilePropTest,
            tile: {
                ...GameTilePropTest.tile,
                type: GroundTexture.SAND,
                data: {
                    key: 1,
                    location: {
                        row: 2,
                        column: 2
                    }
                },
            }
        }
        
        render(<GameTile {...GameTilePropSandTest} />);
        
        const gameTile = screen.getByTestId('tile-2-2');
        expect(gameTile).toHaveClass('tile-texture--sand');
    });

    it('renders with food texture', () => {
        const GameTilePropFoodTest = {
            ...GameTilePropTest,
            tile: {
                ...GameTilePropTest.tile,
                type: GroundTexture.FOOD,
                data: {
                    key: 1,
                    location: {
                        row: 4,
                        column: 3
                    }
                },
            }
        }

        render(<GameTile {...GameTilePropFoodTest} />);
        
        const gameTile = screen.getByTestId('tile-4-3');
        expect(gameTile).toHaveClass('tile-texture--food');
    });

    it('renders with head of sandworm texture', () => {
        const GameTilePropHeadTest = {
            ...GameTilePropTest,
            tile: {
                ...GameTilePropTest.tile,
                type: WormAnatomy.HEAD,
                data: {
                    key: 1,
                    location: {
                        row: 5,
                        column: 3
                    }
                },
            }
        }

        render(<GameTile {...GameTilePropHeadTest} />);
        
        const gameTile = screen.getByTestId('tile-5-3');
        expect(gameTile).toHaveClass('tile-texture--head');
    }) 
    
    it('renders with body of sandworm texture', () => {
        const GameTilePropBodyTest = {
            ...GameTilePropTest,
            tile: {
                ...GameTilePropTest.tile,
                type: WormAnatomy.BODY,
                data: {
                    key: 1,
                    location: {
                        row: 7,
                        column: 6
                    }
                },
            }
        }

        render(<GameTile {...GameTilePropBodyTest} />);
        
        const gameTile = screen.getByTestId('tile-7-6');
        expect(gameTile).toHaveClass('tile-texture--body');
    })  

    it('renders with tail of sandworm texture', () => {
        const GameTilePropTailTest = {
            ...GameTilePropTest,
            tile: {
                ...GameTilePropTest.tile,
                type: WormAnatomy.TAIL,
                data: {
                    key: 1,
                    location: {
                        row: 10,
                        column: 9
                    }
                },
            }
        }

        render(<GameTile {...GameTilePropTailTest} />);
        
        const gameTile = screen.getByTestId('tile-10-9');
        expect(gameTile).toHaveClass('tile-texture--tail');
    })  
});
