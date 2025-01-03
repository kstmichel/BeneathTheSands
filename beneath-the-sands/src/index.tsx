import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import gameData from './library/data.json';
import { WormAnatomy, WormSegment } from './library/definitions';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  const processedSandWormData: WormSegment[] = gameData.sandWorm.map((segment) => {
    const part = Object.values(WormAnatomy).find((value) => value === segment.part);
    if (!part) {
        throw new Error(`Invalid worm part: ${segment.part}`);
    }
    return {
        ...segment,
        part
    };
  });

  const initialGameData = {
    sandWorm: processedSandWormData,
    food: gameData.food
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
