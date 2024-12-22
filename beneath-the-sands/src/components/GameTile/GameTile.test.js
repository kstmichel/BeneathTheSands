import React, { cache } from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import GameTile from './';
import App from '../../App';
import { TileTexture } from '../../library/definitions';

const GameTilePropTestValues = {
    texture: TileTexture.SAND,
    size: 35, 
    coordinate: {
        row: 1,
        column: 1
    },
    children: null, 
    onCollision: () => {console.log('test')}
}

describe('GameTile component renders correctly', () => {
    afterEach(cleanup);

    test('GameTile renders', () => {
        render(<GameTile {...GameTilePropTestValues} />);
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toBeInTheDocument();
    });

    test('GameTile renders with sand texture', () => {
        render(<GameTile {...GameTilePropTestValues} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--sand');
    })  

    test('GameTile renders with food texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.FOOD} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--food');
    })  

    test('GameTile renders with head of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.HEAD} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--head');
    }) 
    
    test('GameTile renders with body of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.BODY} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--body');
    })  

    test('GameTile renders with tail of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.TAIL} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--tail');
    })  
});
