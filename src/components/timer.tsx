"use client";
import { useGameState } from "@/providers/GameStateContext";
import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [count, setCount] = useState(3);
  const { state, dispatch } = useGameState();

  useEffect(() => {
    setCount(6);
    dispatch({type:"TOGGLE_ACTIVE",payload:false}) // Reset countdown when game state changes
  }, [state.gameDifficulty, state.gameLevel,dispatch,state.lives]);

  useEffect(() => {    
   
    if (count === -1){ 
        if (state.lives>0){
          dispatch({type:"TOGGLE_ACTIVE",payload:true})}
        return;
      }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [count]); // Only run when count changes





  let displayText;

  if (count === -1){
    displayText = `` 
  }else if (count < 1) {
    displayText = "Go!";
  } else if ((count <= 3 ) && (count > 0 )) {
    displayText = "Memorize" ;
  }else if (count > 3){
    displayText = count-3
  } 

  if(state.lives<1){
    displayText = "Game Over!";
    }
  
  return (
    <div className="text-center">
      {displayText}
      {count===-1?  <div className="row-span-1 flex flex-row gap-5 justify-center align-middle">
        {Array.from({ length: state.lives }).map((_, index) => (
          <div key={index} className="w-fit h-fit flex flex-col gap-1">
            {/* Render state.chances number of divs */}
            {Array.from({ length: state.chances }).map((_, chanceIndex) => (
              <div key={chanceIndex} className="bg-slate-700 w-5 h-5"></div>
            ))}
          </div>
        ))}
      </div>:""}
    </div>
  );
  
};

export default CountdownTimer;
