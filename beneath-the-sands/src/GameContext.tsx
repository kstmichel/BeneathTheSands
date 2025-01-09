import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextProps {
  wormLength: number;
  speed: number;
  foodEaten: number;
  score: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  increaseFoodEaten: () => void;
  nextLevel: () => void;
  victoryDance: () => void;
  oopsYouLost: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
  const [wormLength, setWormLength] = useState(4);
  const [speed, setSpeed] = useState(300);
  const [foodEaten, setFoodEaten] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const increaseFoodEaten = () => {
    setFoodEaten((prevEaten) => prevEaten + 1);

    increaseWormLength();
    increaseScore();
    increaseSpeed();
  }

  const increaseWormLength = () => (setWormLength((prevLength) => prevLength + 1));
  const increaseScore = () => setScore((prevScore) => prevScore + 100);
  const increaseSpeed = () => setSpeed((prevSpeed) => prevSpeed - 20);
  const nextLevel = () => setLevel((prevLevel) => prevLevel + 1);
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
        increaseFoodEaten,
        nextLevel, 
        victoryDance,
        oopsYouLost
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const MockGameProvider: React.FC<{ children: ReactNode, value: GameContextProps }> = ({ children, value }) => {
    const [wormLength, setWormLength] = useState(value.wormLength);
    const [speed, setSpeed] = useState(value.speed);
    const [foodEaten, setFoodEaten] = useState(value.foodEaten);
    const [score, setScore] = useState(value.score);
    const [level, setLevel] = useState(value.level);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const increaseFoodEaten = () => {
      setFoodEaten((prevEaten) => prevEaten + 1);
  
      increaseWormLength();
      increaseScore();
      increaseSpeed();
    }

    const increaseWormLength = () => setWormLength(prevLength => prevLength + 1);
    const increaseScore = () => setScore(prevScore => prevScore + 100);
    const increaseSpeed = () => setSpeed(prevSpeed => prevSpeed - 50);
    const nextLevel = () => setLevel(prevLevel => prevLevel + 1);
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
      increaseFoodEaten,
      nextLevel, 
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
