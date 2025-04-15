"use client";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { useEffect, useState } from "react";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard"; 
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(false);
  const gameApi = useGame();
  const phase = gameApi.getGamePhase();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  

  return (
    <div>
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <div className="lobby">
        <VerticalFlex>
          <Chat />
        </VerticalFlex>
        {phase === GamePhase.SUMMARY && <SummaryCard />}
        <VerticalFlex>
          <PlayerOverview />
          <Settings />
        </VerticalFlex>
      </div>
    </div>
  );
}

