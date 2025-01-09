import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';
import gameData from './library/data.json';
import { GameData, Direction, WormAnatomy, WormSegment, Food } from './library/definitions';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  const processedSandWormData: WormSegment[] = gameData.sandWorm.map((segment) => {
    const part = Object.values(WormAnatomy).find((value) => value === segment.part);
    if (!part) throw new Error(`Invalid worm part: ${segment.part}`);

    return {
        ...segment,
        part
    };
  });

  const initialGameData: GameData = {
    sandWorm: processedSandWormData as WormSegment[],
    food: gameData.food as Food[],
    startDirection: Direction.RIGHT as Direction,
  }

  root.render(
    <React.StrictMode>
      <App data={initialGameData} />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
