import React, {useState, useEffect} from 'react';
import { GameProvider } from './GameContext'
import './App.css';
import { GameBoard } from './components';
import { WormSegment } from './library/definitions';

interface AppProps {
  data: WormSegment[]
}

function App({data}: AppProps) {
  // This is the main component that will render the game board and all other components
  // State should be managed here and passed down to children components

  // Use Context API to manage timers and other global state
  // Use Reducer to manage game state

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
