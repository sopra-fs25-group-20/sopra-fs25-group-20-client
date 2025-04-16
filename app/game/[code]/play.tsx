"use client";
import { Button } from "@/components/Button";
import { Chat } from "@/components/chat";
import { Gallery } from "@/components/gallery";
import { HorizontalFlex } from "@/components/horizontalFlex";
import { HUD } from "@/components/hud";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { Voting } from "@/components/voting";
import { useGame } from "@/hooks/useGame";
import { HighlightedImage } from "@/types/highlightedImage";
import { Role } from "@/types/role";
import { useState } from "react";

type Props = {
  role: Role;
  highlightedImage: HighlightedImage;
};

export default function PlayPage({ role, highlightedImage }: Props) {
  const gameApi = useGame();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="play-page">
      <VerticalFlex width={350}>
        <PlayerOverview />
        <HUD role={role} />
        {role.playerRole === "spy" && selectedIndex !== null && (
          <HorizontalFlex>
            <Button
              onClick={() => {
                if (selectedIndex !== null) {
                  gameApi.sendGuess(selectedIndex);
                }
              }}
            >
              Guess image {selectedIndex !== null ? `${selectedIndex}` : ""}
            </Button>
          </HorizontalFlex>
        )}
        <Voting />
        <Chat />
      </VerticalFlex>
      <VerticalFlex>
        <Gallery
          role={role}
          highlightedImage={highlightedImage}
          onSelectImage={setSelectedIndex}
        />
      </VerticalFlex>
    </div>
  );
}
