import React, {useState, useEffect} from 'react';
import { GameProvider } from './GameContext';
import { GameBoard } from './components';
import { WindowSize, GameData, ContextData } from './library/definitions';

interface AppProps {
  data: {
    game: GameData,
    context: ContextData,
  }
}

function App({data}: AppProps) {
  // This is the main component that will render the game board and all other components
  // State should be managed here and passed down to children components

  // Use Context API to manage timers and other global state
  // Use Reducer to manage game state

  if (!data || !data.game.sandWorm || !data.game.sandWorm.segments || data.game.sandWorm.segments.length === 0 || !data.game.food || data.game.food.length === 0 || !data.game.sandWorm.startDirection) {
    throw new Error('game element data not found during rendering');
  }

  if (!data.context || !data.context.levels || data.context.levels.length === 0 ) {
    throw new Error('context data not found during rendering');
  }

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      } as WindowSize);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="App">
      <GameProvider data={data.context}>
        <h1 className="text-3xl font-bold underline">Beneath the Sands Introduction</h1>
        <h2 className="text-2xl">Level Cutscene (loading screen)</h2>

        <GameBoard windowSize={windowSize} gameData={data.game} />
      </GameProvider>
    </div>
  );
}

export default App; 
