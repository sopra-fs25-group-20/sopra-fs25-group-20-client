"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { Summary } from "@/types/summary";
import { Player } from "@/types/player";
import { OverflowContainer } from "./overflowContainer";

export const SummaryCard = () => {
  const api = useApi();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const load = async () => {
      const room = stompApi.getCode();
      const [sumRes, plRes] = await Promise.all([
        api.get<Summary>(`/game/result/${room}`),
        api.get<Player[]>(`/players/${room}`)
      ]);
      setSummary(sumRes);
      setPlayers(plRes);
      try {
        const blob = await api.get<Blob>(
          `/image/${room}/${sumRes.highlightedImageIndex}`,
          false
        );
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch {
        setImageUrl("/placeholder.png");
      }
    };

    load();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [api]);

  const roles = summary?.roles ?? {};
  const spyNick = Object.keys(roles).find((n) => roles[n] === "SPY") ?? "";
  const innocentNicks = Object.keys(roles).filter((n) => roles[n] === "INNOCENT");

  const spyPlayer = players.find((p) => p.nickname === spyNick);
  const innocentPlayers = innocentNicks
    .map((n) => players.find((p) => p.nickname === n))
    .filter((p): p is Player => Boolean(p));

  const ProfileRow = ({ p }: { p: Player }) => (
    <div className="profile-card">
      <div className="profile other">
        <div className="icon other" style={{ background: p.color }} />
        <div className="player other" style={{ color: p.color }}>
          <div className="name">{p.nickname}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="summary-card">
      <div className="summary-header">
        <div className="summary-title">The {summary?.winnerRole ?? "?"}s</div>
        <div className="summary-subtitle">have won the game!</div>
      </div>

      <div className="summary-image-wrapper">
        <img
          src={imageUrl ?? "/placeholder.png"}
          alt="Summary Highlight"
          className="summary-image"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
            e.currentTarget.style.objectFit = "contain";
          }}
        />
      </div>

      <div className="summary-roles">
        <div>
          <strong>The Spy:</strong>
          {spyPlayer && <ProfileRow p={spyPlayer} />}
        </div>

        <div>
          <strong>The Innocents:</strong>
          <OverflowContainer>
            {innocentPlayers.map((p) => (
              <ProfileRow key={p.nickname} p={p} />
            ))}
          </OverflowContainer>
        </div>
      </div>
    </div>
  );
};

