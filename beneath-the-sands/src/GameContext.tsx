import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextProps {
  wormLength: number;
//   duration: number;
  foodEaten: number;
  score: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  increaseScore: () => void;
  nextLevel: () => void;
  increaseWormLength: () => void;
  increaseFoodEaten: () => void;
  victoryDance: () => void;
  oopsYouLost: () => void;
}

const initialWormLength = 3;

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
  const [wormLength, setWormLength] = useState(initialWormLength);
//   const [duration, setDuration] = useState(0);
  const [foodEaten, setFoodEaten] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const increaseScore = () => setScore(prevScore => prevScore + 1);
  const nextLevel = () => setLevel(prevLevel => prevLevel + 1);
  const increaseWormLength = () => setWormLength(prevLength => prevLength + 1);
  const increaseFoodEaten = () => setFoodEaten(prevEaten => prevEaten + 1);
  const victoryDance = () => setGameWon(true);
  const oopsYouLost = () => setGameOver(true);

  return (
    <GameContext.Provider value={{ 
        score, 
        level, 
        wormLength, 
        foodEaten, 
        gameOver, 
        gameWon, 
        increaseScore, 
        nextLevel, 
        increaseWormLength, 
        increaseFoodEaten ,
        victoryDance,
        oopsYouLost
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};