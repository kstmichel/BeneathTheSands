import React, {useState, useEffect} from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import { useMediaQuery } from 'react-responsive';
import { GameTile } from '../../components/';

enum TileSkin {
    Sand = "sand",
    Food = "food", 
    Head = "head", 
    Tail = "tail", 
    Body = "body"
}

interface Dimension {
    columns: number;
    rows: number;
}

enum Display {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop'
}

const gridDimensions: Record<string, Dimension> = {
    [Display.Mobile]: { columns: 15, rows: 10 },
    [Display.Tablet]: { columns: 20, rows: 11 },
    [Display.Desktop]: { columns: 30, rows: 15 }
}

function GameBoard() {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

    const displaySize: Display = isMobile ? Display.Mobile : isTablet ? Display.Tablet : Display.Desktop;
    
    const [tileSize, setTileSize] = useState(20); // Default size
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);


  useEffect(() => {
    const numRows = gridDimensions[displaySize].rows;
    const numColumns = gridDimensions[displaySize].columns;

    setRows(numRows);
    setColumns(numColumns);

    const updateTileSize = () => {
      const containerWidth = window.innerWidth * 0.9; // 90% of viewport width
      const containerHeight = window.innerHeight * 0.9; // 90% of viewport height

      // Calculate the maximum possible size for a square tile
      const size = Math.min(
        containerWidth / numColumns,
        containerHeight / numRows
      );

      setTileSize(size);
    };

    // Initial size calculation
    updateTileSize();

    // Update size on window resize
    window.addEventListener("resize", updateTileSize);
    return () => window.removeEventListener("resize", updateTileSize);

  }, [displaySize]);

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
            <Grid 
                container 
                direction={'column'} 
                wrap="wrap" 
                className="grid-container"
                style={{
                    gridTemplateColumns: `repeat(${rows}, 1fr)`,
                    gridTemplateRows: `repeat(${columns}, 1fr)`,
                  }}
            >
                {
                   Array.from({ length: rows }).map((_, index) => (
                        <Grid container direction="row" key={index} wrap="nowrap" className="m-auto">
                            {
                                Array.from({ length: columns }).map((_, tileIndex) => (
                                    <GameTile key={tileIndex} skin={TileSkin.Sand} size={tileSize} onCollision={()=> console.log('collision')} />
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