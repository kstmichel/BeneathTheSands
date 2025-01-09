import React, {useState, useEffect} from 'react';
import { GameProvider } from './GameContext';
import { GameBoard } from './components';
import { WormSegment, Food, Direction } from './library/definitions';

interface AppProps {
  data: {
    sandWorm: WormSegment[],
    food: Food[],
    startDirection: Direction,
  } 
}

function App({data}: AppProps) {
  // This is the main component that will render the game board and all other components
  // State should be managed here and passed down to children components

  // Use Context API to manage timers and other global state
  // Use Reducer to manage game state

  if (!data || !data.sandWorm || data.sandWorm.length === 0 || !data.food || data.food.length === 0 || !data.startDirection) {
    throw new Error('game element data not found during rendering');
  }

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="App">
      <GameProvider>
        <h1 className="text-3xl font-bold underline">Beneath the Sands Introduction</h1>
        <h2 className="text-2xl">Level Cutscene (loading screen)</h2>

        <GameBoard windowSize={windowSize} gameData={data} />
      </GameProvider>
    </div>
  );
}

export default App; 
