'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { useGameState } from "@/providers/GameStateContext";


type Props = {
    value:number;
    playSound: (e:number)=> void;
}



const Cube = ({value, playSound}: Props) => {
    const [color, setColor] = useState<string[]>([
        "bg-blue-400","bg-slate-200 hover:bg-slate-200 border border-slate-500"
      ]);
      // Color for all cells after the highlight period  
      
    const { state, dispatch } = useGameState();
    
  useEffect(()=>{
    setColor(["bg-blue-400","bg-slate-200 hover:bg-slate-200 border border-slate-500"])
    setTimeout(() => {
        setColor(["bg-blue-400 hover:bg-blue-500 cursor-pointer","hover:bg-blue-500 cursor-pointer bg-blue-400 border-blue-400","active"]); // Set all cells to the same color (e.g., blue) after 3 seconds
      }, 3000);
  },[state.lives]) 
  
  const onClickFunct = ()=>{
    if (color[2]==="active"){
    if (value === 1) {
        playSound(1);
    setColor(["bg-blue-400 hover:bg-blue-500 cursor-pointer","bg-white border-white hover:bg-white"])
} else {
    playSound(0);
    setColor(["bg-slate-700","bg-blue-400 border-blue-400 cursor-pointer"])
    dispatch({ type: "USE_CHANCE" })
}
    }
  else {
    console.log("Nothing")
  }
  }




  return (
    <div
            className={cn("flex items-center justify-center rounded  transition-all duration-200 aspect-square", value == 1 && color[1], value == 0 && color[0])}
            onClick={onClickFunct} >
          </div>
  )
}

export default Cube