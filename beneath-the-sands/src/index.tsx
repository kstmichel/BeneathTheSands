import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';
import gameData from './library/data.json';
import { GameData, ContextData, Direction, WormAnatomy, WormSegment, Food } from './library/definitions';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  const strDirection: string = gameData.game.sandWorm.startDirection;

  const defaultSandwormDirection: Direction | undefined = (Object.values(Direction) as string[]).includes(strDirection) ? strDirection as Direction : undefined;
  const processedSandWormData: WormSegment[] = gameData.game.sandWorm.segments.map((segment) => {
    const part = Object.values(WormAnatomy).find((value) => value === segment.part);
    if (!part) throw new Error(`Invalid worm part: ${segment.part}`);

    return {
        ...segment,
        part
    };
  });

  const appData = {
    game: {
      sandWorm: {
        startDirection: defaultSandwormDirection || Direction.RIGHT,
        segments: processedSandWormData,
      },
      food: gameData.game.food as Food[],
    } as GameData,
    context: gameData.context as ContextData

  }

  root.render(
    <React.StrictMode>
      <App data={appData} />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
