import React, {useState, useEffect} from 'react';
import './App.css';
import { GameBoard } from './components';

function App() {
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
      <h1 className="text-3xl font-bold underline">Beneath the Sands Introduction</h1>
      <h2 className="text-2xl">Level Cutscene (loading screen)</h2>
      <GameBoard windowSize={windowSize} />
      <h4 className="text-lg">Inside Game board will be GameTile component (food/sand/worm/etc.)</h4>
    </div>
  );
}

export default App; 
