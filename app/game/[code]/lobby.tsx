import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard";
import { GamePhase } from "@/types/gamePhase";
import { useTheme } from "@/context/ThemeContext";
import { Player } from "@/types/player";

type Props = {
  phase: GamePhase;
  players: Player[];
};

export default function LobbyPage({ phase, players }: Props) {
  const { toggleTheme } = useTheme();

  return (
    <div className="lobby">
      <AppHeader onToggleTheme={toggleTheme} />
      <VerticalFlex>
        <Chat />
      </VerticalFlex>
      {phase === GamePhase.SUMMARY && <SummaryCard />}
      <VerticalFlex>
        <PlayerOverview phase={phase} players={players} />
        <Settings players={players} />
      </VerticalFlex>
    </div>
  );
}
