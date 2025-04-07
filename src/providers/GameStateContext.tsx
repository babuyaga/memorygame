import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define state structure
type GameState = {
  gameLevel: number;
  gameDifficulty: number; // Changed from string to number
  levelScore: number;
  chances: number;
  lives: number;
  isActive: boolean;
  gameState:number;
  totalScore:number; // New property
};

// Define action types
type GameAction =
  | { type: "SET_LEVEL"; payload: number }
  | { type: "SET_DIFFICULTY"; payload: number } // Updated to number
  | { type: "INCREASE_SCORE"; payload: number }
  | { type: "DECREASE_SCORE"; payload: number }
  | { type: "USE_CHANCE" }
  | { type: "LOSE_LIFE" }
  | { type: "RESET_GAME" }
  | { type: "TOGGLE_ACTIVE"; payload: boolean }
  | { type: "INCREASE_TOTAL"; payload:number}
  | { type: "CHANGE_STATE"; payload:number}; // New action

// Initial state
const initialState: GameState = {
  gameLevel: 4,
  gameDifficulty: 8, // Default difficulty as a number
  levelScore: 0,
  chances: 3,
  lives: 3,
  isActive: false,
  gameState:0,
  totalScore:0, // Default state
};

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_LEVEL":
      return { ...state, gameLevel: action.payload };
    case "SET_DIFFICULTY":
      return { ...state, gameDifficulty: action.payload };
    case "INCREASE_SCORE": {
      const newScore = state.levelScore + action.payload;
      const totalScore = state.totalScore + action.payload;
      if (newScore !== state.gameDifficulty) {
        return { ...state, levelScore: newScore,totalScore: totalScore };
      }
    
      const isMaxDifficultyReached = state.gameDifficulty >= Math.floor((state.gameLevel * state.gameLevel) / 2);
      const newLevel = isMaxDifficultyReached ? state.gameLevel + 1 : state.gameLevel;
      const newDifficulty = isMaxDifficultyReached
        ? Math.floor((newLevel * newLevel) / 3)
        : state.gameDifficulty + 1;
      
    
      return { ...state, levelScore: 0,chances:3, gameLevel: newLevel, gameDifficulty: newDifficulty,totalScore: newScore };
    }
    case "DECREASE_SCORE":
      return { ...state, levelScore: Math.max(0, state.levelScore - action.payload) };
    case "USE_CHANCE":
      const newChances = Math.max(0, state.chances - 1);
      const newLives = newChances === 0 ? Math.max(0, state.lives - 1) : state.lives;
      const newScore = state.totalScore - 0.5;
      return {
        ...state,
        chances: newChances === 0 ? 3 : newChances,
        lives: newLives,
        ...(newLives === 0 && { chances: 0 }),
        totalScore:newScore // Reset on game over
      };
    case "LOSE_LIFE":
      const updatedLives = Math.max(0, state.lives - 1);
      return {
        ...state,
        lives: updatedLives,
        ...(updatedLives === 0 && { gameLevel: 4, gameDifficulty: 5 , isActive:false}), // Reset on game over
      };
    case "RESET_GAME":
      return initialState;
    case "TOGGLE_ACTIVE": // Handle isActive toggle
      return { ...state, isActive: action.payload };
    case "INCREASE_TOTAL":
      const newTotal = state.totalScore+ action.payload
      return {...state, totalScore:newTotal}
    case "CHANGE_STATE":
      const newgameState = action.payload;
      console.log("Change State")
      return {...state, gameState:newgameState}
    default:
      return state;
  }
};

// Create context
const GameStateContext = createContext<
  { state: GameState; dispatch: React.Dispatch<GameAction> } | undefined
>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook for consuming context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
