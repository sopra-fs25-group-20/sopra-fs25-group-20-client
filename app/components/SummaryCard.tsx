"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Frame } from "./frame";
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

export const SummaryCard = () => {
  const params = useParams();
  const code = params.code as string;

  const apiService = useApi();
  const gameApi = useGame();

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

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

  const spyRole = summary?.roles.find((r) => r.playerRole === "SPY");
  const innocentRoles = summary?.roles.filter((r) =>
    r.playerRole === "INNOCENT"
  );
  const spy = summary?.players.find((p) => p.nickname === spyRole?.nickname);
  const innocents =
    summary?.players.filter((p) =>
      innocentRoles?.some((r) => r.nickname === p.nickname)
    ) ?? [];

  return (
    <Frame className="summary-card">
      {error
        ? (
          <div className="summary-placeholder">
            Summary data could not be loaded.
          </div>
        )
        : (
          <>
            <div className="summary-title">
              The {summary?.winning_role ?? "?"}s
            </div>
            <div className="summary-subtitle">have won the game!</div>
            <img
              src={`/image/${code}/${highlightedIndex ?? 0}`}
              alt="Summary Highlight"
              className="summary-image"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
                e.currentTarget.style.objectFit = "contain";
              }}
            />
            <div>
              <strong>The Spy:</strong>
              <br />
              {spy?.nickname ?? "Unknown"}
            </div>
            <div>
              <strong>The Innocents:</strong>
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                {innocents.map((p) => <li key={p.nickname}>{p.nickname}</li>)}
              </ul>
            </div>
          </>
        )}
    </Frame>
  );
};
