import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define state structure
type GameState = {
  gameLevel: number;
  gameDifficulty: number; // Changed from string to number
  totalScore: number;
  chances: number;
  lives: number;
};

// Define action types
type GameAction =
  | { type: "SET_LEVEL"; payload: number }
  | { type: "SET_DIFFICULTY"; payload: number } // Updated to number
  | { type: "INCREASE_SCORE"; payload: number }
  | { type: "DECREASE_SCORE"; payload: number }
  | { type: "USE_CHANCE" }
  | { type: "LOSE_LIFE" }
  | { type: "RESET_GAME" };

// Initial state
const initialState: GameState = {
  gameLevel: 3,
  gameDifficulty: 4, // Default difficulty as a number
  totalScore: 0,
  chances: 3,
  lives: 3,
};

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_LEVEL":
      return { ...state, gameLevel: action.payload };
    case "SET_DIFFICULTY":
      return { ...state, gameDifficulty: action.payload }; // Now expects a number
    case "INCREASE_SCORE":
      return { ...state, totalScore: state.totalScore + action.payload };
    case "DECREASE_SCORE":
      return { ...state, totalScore: Math.max(0, state.totalScore - action.payload) };
      case "USE_CHANCE":
        const newChances = Math.max(0, state.chances - 1);
        const newLives = newChances === 0 ? Math.max(0, state.lives - 1) : state.lives;
      
        return {
          ...state,
          chances: newChances === 0 ? 3 : newChances, // Reset chances if life is lost
          lives: newLives,
        };
    case "LOSE_LIFE":
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case "RESET_GAME":
      return initialState;
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
