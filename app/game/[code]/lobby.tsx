"use client";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { useEffect, useState } from "react";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard";
import { GamePhase } from "@/types/gamePhase";

type Props = {
  phase: GamePhase;
};

export default function LobbyPage({ phase }: Props) {
  const [darkMode, setDarkMode] = useState(false);

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
