"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { PlayerOverview } from "@/components/PlayerOverview";
import { Settings } from "@/components/Settings";
import { VerticalFlex } from "@/components/verticalFlex";
import { SummaryCard } from "@/components/SummaryCard";
import { stompApi } from "@/api/stompApi";
import { useApi } from "@/hooks/useApi";
import { useGame } from "@/hooks/useGame";
import { Player } from "@/types/player";

interface Role {
  nickname: string;
  playerRole: string;
}

interface SummaryData {
  players: Player[];
  roles: Role[];
  winning_role: string;
}

export default function SummaryPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const params = useParams();
  const apiService = useApi();
  const gameApi = useGame();
  const code = params.code as string;

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const nickname = stompApi.getNickname();
    const admin = stompApi.getRoomAdmin?.();
    if (!admin && nickname) {
      stompApi.setRoomAdmin(nickname);
    }
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await apiService.get<SummaryData>(`/summary/${code}`);
        setSummary(data);
      } catch {
        setError("Could not fetch game summary.");
      }
    };
    fetchSummary();
  }, [code, apiService]);

  useEffect(() => {
    gameApi.onHighlightedImage((data) => {
      setHighlightedIndex(data.index);
    });
    gameApi.requestHighlightedImage();
  }, [gameApi]);

  const renderSummaryCard = () => {
    const spyRole = summary?.roles.find((r) => r.playerRole === "SPY");
    const innocentRoles = summary?.roles.filter((r) => r.playerRole === "INNOCENT");
    const spy = summary?.players.find((p) => p.nickname === spyRole?.nickname);
    const innocents =
      summary?.players.filter((p) =>
        innocentRoles?.some((r) => r.nickname === p.nickname)
      ) ?? [];

    return (
      <SummaryCard
        code={code}
        winningRole={summary?.winning_role ?? "?"}
        spyName={spy?.nickname ?? "Unknown"}
        innocentNames={innocents.map((p) => p.nickname)}
        error={!summary ? error : undefined}
        imageIndex={highlightedIndex ?? 0}
      />
    );
  };

  return (
    <div>
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <div className="lobby">
        <VerticalFlex>
          <Chat />
        </VerticalFlex>
        <VerticalFlex>
          {renderSummaryCard()}
        </VerticalFlex>
        <VerticalFlex>
          <PlayerOverview />
          <Settings />
        </VerticalFlex>
      </div>
    </div>
  );
}
