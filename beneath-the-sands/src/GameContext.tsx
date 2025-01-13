import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ContextData, DropInventory } from './library/definitions';

interface GameContextProps {
  wormLength: number;
  speed: number;
  foodEaten: number;
  maxActiveDrops: number,
  dropInventory: DropInventory,
  score: number;
  level: number;
  gameOver: boolean;
  gameWon: boolean;
  increaseFoodEaten: () => void;
  nextLevel: () => void;
  victoryDance: () => void;
  oopsYouLost: () => void;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ data: ContextData, children: ReactNode }> = ({ data, children }) => { 
  const maxActiveDrops: number = 5;
  
  const [wormLength, setWormLength] = useState(4);
  const [speed, setSpeed] = useState(300);
  const [foodEaten, setFoodEaten] = useState(0);
  const [dropInventory, setDropInventory] = useState<DropInventory>(data.levels[0].drops);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const increaseWormLength = () => (setWormLength((prevLength) => prevLength + 1));
  const increaseScore = () => setScore((prevScore) => prevScore + 100);
  const increaseSpeed = () => setSpeed((prevSpeed) => prevSpeed - 20);
  const removeFoodFromDropInventory = () => setDropInventory((prevInventory) => ({...prevInventory, food: prevInventory.food - 1}));
  
  const victoryDance = () => setGameWon(true);
  const oopsYouLost = () => setGameOver(true);

  const increaseFoodEaten = () => {
    setFoodEaten((prevEaten) => prevEaten + 1);

    increaseWormLength();
    increaseScore();
    increaseSpeed();

    if(dropInventory.food > 0){
      removeFoodFromDropInventory();
    }
  }

  const nextLevel = () => { 
    const newLevel: number = level + 1;
    setLevel((prevLevel) => prevLevel + 1);
    setDropInventory(data.levels[newLevel - 1].drops);
  };

  return (
    <GameContext.Provider value={{ 
        score, 
        level, 
        wormLength, 
        speed,
        foodEaten, 
        maxActiveDrops,
        dropInventory,
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
