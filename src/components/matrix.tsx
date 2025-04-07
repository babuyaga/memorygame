'use client';

import React, { useEffect, useState } from "react";
import { useGameState } from "@/providers/GameStateContext";
import Cube from "./VisualMemory/cube";
import { cn } from "@/lib/utils";
import CountdownTimer from "./Timer";

// Type definition for Matrix props
type MatrixProps = {
  n?: number; // Optional: number of rows/columns for the matrix
  L?: number; // Optional: number of cells that should have the value 1
};

const Matrix: React.FC<MatrixProps> = ({ n, L }) => {
  // State to store the 2D matrix of game cells
  const [matrix, setMatrix] = useState<number[][]>([]);
  
  // State to store the CountdownTimer component (not used in this code)
  const [timer, setTimer] = useState<React.FC>();

  // Audio files for different game events
  let winAudio = new Audio('./sounds/winner.wav');
  let correctAudio = new Audio('./sounds/correct_click.wav');
  let loseAudio = new Audio('./sounds/loser.wav');
  let wrongAudio = new Audio('./sounds/wrong_click.wav');

  // Accessing the game state and dispatch from context
  const { state, dispatch } = useGameState();

  // Function to play sound based on the value (1 or 0)
  const playSound = (value: number) => {
    let AudDio = new Audio();
    if (value === 1) {
      AudDio = correctAudio; // Correct answer sound
    } else {
      AudDio = wrongAudio; // Wrong answer sound
    }

    AudDio.pause();  // Stop the audio
    AudDio.currentTime = 0;  // Reset to the start
    AudDio.play(); // Play the audio
  }

  // Effect to generate a new matrix after a delay based on game state
  useEffect(() => {
    setMatrix([]); // Clear the current matrix before generating a new one

    // Set a timeout to generate the matrix after 3 seconds
    const timeout = setTimeout(() => {
      const generateMatrix = () => {
        const size = state.gameLevel * state.gameLevel; // Calculate the size of the matrix based on game level

        if (state.lives > 0) {
          // Create a 1D array filled with 0s (empty cells)
          const matrix = Array.from({ length: size }, () => 0);

          // Randomly place '1' in the matrix to represent correct cells
          let onesPlaced = 0;
          while (onesPlaced < state.gameDifficulty) {
            const randomIndex = Math.floor(Math.random() * size); // Random index in the 1D matrix
            if (matrix[randomIndex] === 0) { // Ensure the position is empty
              matrix[randomIndex] = 1; // Place a '1' at the random position
              onesPlaced++; // Increment the number of placed 1s
            }
          }

          // Convert the 1D array to a 2D matrix (matrix of rows and columns)
          return Array.from({ length: state.gameLevel }, (_, row) =>
            matrix.slice(row * state.gameLevel, (row + 1) * state.gameLevel)
          );
        } else {
          // If no lives left, return a matrix of all 0s (no correct answers)
          return Array.from({ length: state.gameLevel }, () =>
            Array(state.gameLevel).fill(0)
          );
        }
      };

      setMatrix(generateMatrix()); // Set the generated matrix
    }, 3000); // Wait for 3 seconds before generating the matrix

    return () => clearTimeout(timeout); // Cleanup timeout on unmount or dependencies change
  }, [state.gameLevel, state.gameDifficulty, state.lives]); // Effect depends on gameLevel, gameDifficulty, and lives

  return (
    <div className="grid grid-rows-6 w-full h-screen m-auto">
      <div className="grid row-span-5 grid-cols-2 border items-center justify-center w-full h-full my-auto transition-all duration-75">
        
        {/* Render the matrix as a grid */}
        <div
          className={cn(
            `grid gap-1 col-span-1 md:max-w-[500px] m-auto md:max-h-[500px] w-fit h-[50%] transition-all duration-100`,
            !state.isActive ? "pointer-events-none" : "" // Disable interaction if game is inactive
          )}
          style={{
            gridTemplateColumns: `repeat(${state.gameLevel}, 1fr)`, // Set number of columns based on game level
            gridTemplateRows: `repeat(${state.gameLevel}, 1fr)`, // Set number of rows based on game level
          }}
        >
          {/* Map over the matrix to create Cube components for each cell */}
          {matrix.flat().map((value, index) => (
            <Cube key={index} value={value} playSound={playSound} />
          ))}
        </div>

        {/* Countdown Timer */}
        <span className="p-10 text-9xl font-bold ml-10">
          <CountdownTimer />
        </span>
      </div>
      <div className="p-10 h-fit">
      <p>The game is straightforward: memorize the white squares and click on them. You have three chances to match each pattern, and for every three incorrect attempts, you lose a life. If you lose all three lives, the game is over.</p>

      </div>
    </div>
  );
};

export default Matrix;





    {/* <div className="col-span-1 border"> 
    <span className="flex flex-col">{Object.entries(state).map(([key, value]) => (
      <h2 key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {String(value)}</h2>))}
    </span>
    <span className="flex flex-col">
        <button onClick={()=>{dispatch({type:"RESET_GAME"})}}> Reset Game</button>
        <button onClick={()=>{dispatch({type:"SET_LEVEL",payload:state.gameLevel+1})}}> inCrease level</button>
        <button onClick={()=>{dispatch({type:"SET_DIFFICULTY",payload:state.gameDifficulty+1})}}> Increase Difficulty</button>
        <button onClick={()=>{dispatch({type:"INCREASE_SCORE",payload:1})}}> Increase Score</button>
        <button onClick={()=>{dispatch({type:"USE_CHANCE"})}}> Use Chance Score</button>
        <button onClick={()=>{dispatch({type:"TOGGLE_ACTIVE",payload:true})}}> Activate Game</button>
        <button onClick={()=>{dispatch({type:"CHANGE_STATE",payload:3})}}> Change Game State</button>
    </span>
</div> */}