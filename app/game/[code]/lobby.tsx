"use client";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard";
import { GamePhase } from "@/types/gamePhase";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  phase: GamePhase;
};

export default function LobbyPage({ phase }: Props) {
  const { toggleTheme } = useTheme();

  return (
    <div>
      <AppHeader onToggleTheme={toggleTheme} />
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
