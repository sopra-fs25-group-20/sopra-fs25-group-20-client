"use client";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard";
import { GamePhase } from "@/types/gamePhase";
import { useTheme } from "@/context/ThemeContext";
import { useParams } from "next/navigation";

type Props = {
  phase: GamePhase;
};

export default function LobbyPage({ phase }: Props) {
  const { toggleTheme } = useTheme();
  const { code } = useParams();

  return (
    <div>
      <AppHeader onToggleTheme={toggleTheme} />
      <div className="px-4 py-2 bg-gray-100 rounded-md text-center mb-4">
         <span className="font-medium">Game code:</span> <code>{code}</code>
      </div>
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
