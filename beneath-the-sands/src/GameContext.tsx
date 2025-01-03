import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextProps {
  wormLength: number;
  speed: number;
  foodEaten: number;
  score: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  increaseScore: () => void;
  increaseSpeed: () => void;
  nextLevel: () => void;
  increaseWormLength: () => void;
  increaseFoodEaten: () => void;
  victoryDance: () => void;
  oopsYouLost: () => void;
}

const initialWormLength = 4;

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
  const [wormLength, setWormLength] = useState(initialWormLength);
  const [speed, setSpeed] = useState(200);
  const [foodEaten, setFoodEaten] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const increaseScore = () => setScore(prevScore => prevScore + 1);
  const increaseSpeed = () => setSpeed(prevSpeed => prevSpeed - 200);
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
        speed,
        foodEaten, 
        gameOver, 
        gameWon, 
        increaseScore, 
        increaseSpeed,
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

export const MockGameProvider: React.FC<{ children: ReactNode, value: GameContextProps }> = ({ children, value }) => {
  return (
    <GameContext.Provider value={value}>
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
