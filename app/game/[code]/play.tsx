"use client";
import { Chat } from "@/components/chat";
import { Gallery } from "@/components/gallery";
import { HUD } from "@/components/hud";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";
import { Voting } from "@/components/voting";
import { Role } from "@/types/role";

type Props = {
  role: Role;
};

export default function PlayPage({ role }: Props) {
  return (
    <div className="play-page">
      <VerticalFlex width={350}>
        <PlayerOverview />
        <HUD role={role} />
        <Voting />
        <Chat />
      </VerticalFlex>
      <VerticalFlex>
        <Gallery />
      </VerticalFlex>
    </div>
  );
}
