**Beneath the Sands** is a 2D snake-inspired game where you control a sandworm navigating a mysterious desert. Traverse the sands, collect items to grow, and use unique mechanics like burrowing beneath the sand and traveling through portals to avoid your own tail.  

Please note, this game is still a work in progress and currently in its "ugly duckling" phase. Built with React, TypeScript, and Jest for testing, I am actively working on integrating Phaser to evolve this simple React game into a fully realized gaming experience.

The following game features have been implemented and are supported by unit tests:

   ## Current Functionality  
   - **Move Sandworm**: Control the sandworm with the arrow keys found on your keyboard.  
   - **Eat Food**: Collide with a food tile and watch the sandworm increase in length and speed!  
   - **Drops Inventory**: Food is removed from the inventory each time it is added to the board, effectively controlling the number of drops per level.
   - **Next Level**: When all food is eaten and nothing is left in the drop inventory you advance to the next level.

## Upcoming Functionality  
- **Lose Game**: When the sandworm collides with it's own body the game is lost.
- **Try Again**: When the game is lost the user has the ability to restart the game.
- **New Drop Types**: Drops that increase score will be added to the game (coins, rubies).

## Upcoming UI Upgrades
- **Sandworm Sprite**: The sandworm will evolve from simple black-and-white blocks into a fully designed sprite, complete with original animations.
- **Gameboard Design**: The game board will have a stylized design to help immerse the user into this dystopian other-worldy environment.
- **Introduction Screen**: The game will kick off with a captivating introduction, featuring eye-catching artwork designed to draw players into the world of the sandworm from the very first moment.

## Game Concept (WIP)
- **Classic Snake Gameplay**: Grow as you collect objects, but avoid colliding with your tail.  
- **Burrowing Mechanic**: Temporarily go beneath the sands to escape tricky situations.  
- **Portal Travel**: End the level by moving sandworm through a fully-charged portal to move on to the next realm.  
- **Responsive Design**: Playable on desktop and mobile devices.  
- **Unique Art Style**: Inspired by Tim Burton's Beetlejuice, the sandworm comes to life with original designs and animations.  

## Getting Started  

### Prerequisites  
To run this project locally, ensure you have the following installed:  
- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  

### Installation  
1. Clone the repository:  
   ```
    bash  
    git clone https://github.com/your-username/beneath-the-sands.git  
    cd beneath-the-sands  
   ```

2. Install dependencies:
    ```
    bash
    Copy code
    npm install  
    ```

3. Start the development server:
    ```
    bash
    Copy code
    npm start  
    ```

4. Open the game in your browser:
   Navigate to http://localhost:3000

Run the test suite with:
   ```
   bash
   Copy code
   npm test
   ```

## How to Play
Use arrow keys or swipe gestures to control the sandworm.
Collect objects to grow longer and score points.
*Coming Soon* - Avoid running into your own tail or the edges of the map.
*Coming Soon* - Use burrowing areas or portal holes strategically to survive.

## Built With
React: For building the game interface.
TypeScript: Ensures type safety and scalability.
*Coming Soon* - Phaser: For rendering game graphics.

## Roadmap
Planned updates for the game include:

    New levels with increasing difficulty.
    Additional collectible types.
    Enhanced animations and sound effects.
    Leaderboard integration.

## Acknowledgments
Inspired by classic snake games and the surreal aesthetic of Tim Burton’s work.
Special thanks to the open-source community for tools and resources.

Enjoy exploring Beneath the Sands, and good luck mastering the sandworm!
