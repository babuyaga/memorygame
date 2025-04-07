'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useGameState } from "@/providers/GameStateContext";

// Type definition for Cube props
type Props = {
    value: number; // The value of the cube (0 or 1)
    playSound: (e: number) => void; // Function to play sound based on the value
};

const Cube = ({ value, playSound }: Props) => {
    // State to manage the cube's color classes
    const [color, setColor] = useState<string[]>([
        "bg-blue-400", "bg-slate-200 hover:bg-slate-200 border border-slate-500"
    ]);

    // State to track if the cube has been clicked
    const [clicked, setClicked] = useState<boolean>(false);

    // Accessing the game state and dispatch from the context
    const { state, dispatch } = useGameState();

    // Effect hook to set the cube's color after 3 seconds based on the game state
    useEffect(() => {
        // Initially set the color classes
        setColor([
            "bg-blue-400", "bg-slate-200 scale-90 hover:bg-slate-200 border border-slate-500"
        ]);

        // Change color after 3 seconds based on the number of lives
        setTimeout(() => {
            if (state.lives === 0) {
                setColor(["bg-slate-800", "bg-slate-800"]); // Set color to gray when no lives are left
            } else {
                // Set color to blue and make it clickable when lives are greater than 0
                setColor([
                    "bg-blue-400 hover:bg-blue-500 cursor-pointer",
                    "hover:bg-blue-500 cursor-pointer bg-blue-400 border-blue-400", "active"
                ]);
            }
        }, 3000);
    }, [state.lives, state.gameDifficulty, state.gameLevel]); // Dependencies: change when lives, difficulty, or level changes

    useEffect(() => {
        // Empty effect hook, can be used to trigger something based on `state.isActive`
    }, [state.isActive]); // Trigger when `state.isActive` changes

    // Function to handle cube click events
    const onClickFunct = () => {
        if ((state.isActive) && (!clicked)) { // Check if the game is active and cube hasn't been clicked
            setClicked(true); // Set clicked state to true when the cube is clicked

            if (value === 1) { // If the cube value is 1 (correct answer)
                playSound(1); // Play correct sound
                setColor([
                    "bg-blue-400 hover:bg-blue-500 cursor-pointer", // Change the color to indicate success
                    "bg-white border-white hover:bg-white"
                ]);
                dispatch({ type: "INCREASE_SCORE", payload: 1 }); // Increase score
            } else { // If the cube value is 0 (wrong answer)
                playSound(0); // Play wrong sound
                setColor([
                    "bg-slate-700", // Set color to indicate failure
                    "bg-blue-400 border-blue-400 cursor-pointer"
                ]);
                dispatch({ type: "USE_CHANCE" }); // Use a chance when clicked on a wrong cube
            }
        } else {
            console.log("Nothing"); // Log if the cube is clicked when not active or already clicked
        }
    };

    // JSX to render the cube div with dynamic classes and the onClick event
    return (
        <div
            className={cn(
                "flex items-center justify-center rounded transition-all duration-200 aspect-square", 
                value == 1 && color[1], // Apply color for value 1 (correct answer)
                value == 0 && color[0], // Apply color for value 0 (wrong answer)
                state.lives == 0 && "bg-slate-900" // Change color when no lives are left
            )}
            onClick={onClickFunct} // Set the click event handler
        >
        </div>
    );
}

export default Cube;
