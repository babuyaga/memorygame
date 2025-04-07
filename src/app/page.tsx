'use client'
import Matrix from "@/components/matrix";
import { GameStateProvider } from "@/providers/GameStateContext";

export default function Home() {
  return (
    <div className="flex flex-col justify-center align-middle">
      <div className="bg-violet-300 w-full mx-auto h-fit min-h-screen max-w-[1900px] flex justify-center align-middle">
      <GameStateProvider>
     <Matrix/>
     </GameStateProvider>
     </div>
    </div>
  );
}
