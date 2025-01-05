import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this import is present
import GameTile from './';
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

afterEach(cleanup);

describe('GameTile component renders correctly', () => {

    it('renders with sand texture', () => {
        /*  GIVEN the game tile renders
            WHEN 
        */
        render(<GameTile {...GameTilePropTestValues} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--sand');
    });

    it('renders with food texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.FOOD} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--food');
    });

    it('renders with head of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.HEAD} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--head');
    }) 
    
    it('renders with body of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.BODY} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--body');
    })  

    it('renders with tail of sandworm texture', () => {
        render(<GameTile {...GameTilePropTestValues} texture={TileTexture.TAIL} />);
        
        const gameTile = screen.getByTestId('tile-1-1');
        expect(gameTile).toHaveClass('tile-texture--tail');
    })  
});
