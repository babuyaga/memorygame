'use client'
import React, { useEffect, useState } from "react";
import { useGameState } from "@/providers/GameStateContext";
import Cube from "./VisualMemory/cube";

type MatrixProps = {
  n?: number;
  L?: number; // Number of cells that should have the value 1
};

const Matrix: React.FC<MatrixProps> = ({ n, L }) => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  let winAudio = new Audio('./sounds/winner.wav');
  let correctAudio = new Audio('./sounds/correct_click.wav');
  let loseAudio = new Audio('./sounds/loser.wav');
  let wrongAudio = new Audio('./sounds/wrong_click.wav');
  const { state, dispatch } = useGameState();
  
  const playSound = (value:number)=>{
    let AudDio = new Audio();
    if (value==1){
      AudDio = correctAudio
    } else {
      AudDio = wrongAudio;
    }

    AudDio.pause();  // Stop the audio
    AudDio.currentTime = 0;  // Reset to the start
    AudDio.play();
  }
  

  useEffect(() => {
    const generateMatrix = () => {
      const n = state.gameLevel;
      const L = state.gameDifficulty;
      // Create an array of n*n elements filled with 0s
      const matrix = Array.from({ length: n * n }, () => 0);

      // Randomly select L positions to be 1
      let onesPlaced = 0;
      while (onesPlaced < L) {
        const randomIndex = Math.floor(Math.random() * (n * n));
        if (matrix[randomIndex] === 0) {
          matrix[randomIndex] = 1;
          onesPlaced++;
        }
      }

      // Convert the 1D matrix back to a 2D matrix
      return Array.from({ length: n }, (_, row) =>
        matrix.slice(row * n, (row + 1) * n)
      );
    };

    setMatrix(generateMatrix());
  }, [n, L,state.lives,state.gameLevel,state.gameDifficulty]);




  return (
    <div className="flex flex-col items-center justify-center w-full h-fit my-auto transition-all duration-75">
      <h2>Lives: {state.lives}</h2>
      <h2>Chances Left: {state.chances}</h2>
      <div
        className={`grid gap-1 max-w-[300px] max-h-[300px] md:max-w-[500px] md:max-h-[500px] w-full h-[50%]`}
        style={{
          gridTemplateColumns: `repeat(${state.gameLevel}, 1fr)`,
          gridTemplateRows: `repeat(${state.gameLevel}, 1fr)`,
        }}
      >
        {matrix.flat().map((value, index) => (
          <Cube key={index} value={value} playSound={playSound}/>
        ))}
      </div>
    </div>
  );
};

export default Matrix;
