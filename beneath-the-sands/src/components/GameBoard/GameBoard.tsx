import React from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import styled from '@mui/material/styles/styled';
import { useMediaQuery } from 'react-responsive';

interface Dimension {
    width: number;
    height: number;
}

enum Display {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

const gridDimensions: Record<string, Dimension> = {
    [Display.Mobile]: { width: 15, height: 10 },
    [Display.Tablet]: { width: 20, height: 11 },
    [Display.Desktop]: { width: 30, height: 15 }
}

const Tile = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px solid #000',
  }));

function GameBoard() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

    const displaySize: Display = isMobile ? Display.Mobile : isTablet ? Display.Tablet : Display.Desktop;

    return (
        <>
         <Box id="game-board" >
            {/* 
            Suggested Grid Sizes:
                - Small Screens (Mobile):
                  15x10: Great for a smaller display, keeps gameplay focused.
                - Medium Screens (Tablets/Small Monitors):
                  20x11: Provides a good balance of challenge and visibility.
                - Large Screens (Desktops):
                  30x15: Allows for more complex movement and strategies. 
            */}

            {displaySize}
            <Grid container direction={'column'} wrap="wrap" className="grid-container">
                {
                   Array.from({ length: gridDimensions[displaySize].height }).map((_, index) => (
                        <Grid container direction="row" key={index} wrap="nowrap" className="bg-green-700">
                            {
                                Array.from({ length: gridDimensions[displaySize].width }).map((_, tileIndex) => (
                                <Grid key={tileIndex} className="grid-item">
                                    <Tile key={tileIndex}>{tileIndex + 1}</Tile>
                                </Grid>
                                ))
                            }
                        </Grid>
                    ))
                }
            </Grid>
         </Box>
        </>
    )
}

export default GameBoard;