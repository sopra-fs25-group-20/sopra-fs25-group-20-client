"use client";
import { Chat } from "@/components/chat";
import { Gallery } from "@/components/gallery";
import { PlayerOverview } from "@/components/PlayerOverview";
import { VerticalFlex } from "@/components/verticalFlex";

export default function PlayPage() {
  return (
    <div className="play-page">
      <VerticalFlex width={350}>
        <PlayerOverview />
        <Chat />
      </VerticalFlex>
      <VerticalFlex>
        <Gallery />
      </VerticalFlex>
    </div>
  );
}
