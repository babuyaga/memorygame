'use client'
import Matrix from "@/components/matrix";
import { GameStateProvider } from "@/providers/GameStateContext";

export default function Home() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="bg-violet-300 w-full mx-auto h-screen flex">
      <GameStateProvider>
     <Matrix n={4} L={5}/>
     </GameStateProvider>
     </div>
    </div>
  );
}
