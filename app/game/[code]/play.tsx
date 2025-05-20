"use client";
import { Chat } from "@/components/chat";
import { Gallery } from "@/components/gallery";
import { HUD } from "@/components/hud";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { Voting } from "@/components/voting";
import { GamePhase } from "@/types/gamePhase";
import { HighlightedImage } from "@/types/highlightedImage";
import { Role } from "@/types/role";
import { Player } from "@/types/player";

type Props = {
  role: Role;
  highlightedImage: HighlightedImage;
  phase: GamePhase;
  players: Player[];
};

export default function PlayPage({
  role,
  highlightedImage,
  phase,
  players,
}: Props) {
  return (
    <div className="play-page">
      <VerticalFlex width={350}>
        <PlayerOverview players={players} phase={phase} />
        <Voting phase={phase} />
        <Chat />
      </VerticalFlex>
      <VerticalFlex>
        <HUD role={role} />
        <Gallery
          role={role}
          highlightedImage={highlightedImage}
          phase={phase}
        />
      </VerticalFlex>
    </div>
  );
}
