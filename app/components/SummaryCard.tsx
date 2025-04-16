"use client";

import { useEffect, useState } from "react";
import { Frame } from "./frame";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { Summary } from "@/types/summary";
import { HorizontalFlex } from "./horizontalFlex";
import { VerticalFlex } from "./verticalFlex";

export const SummaryCard = () => {
  const apiService = useApi();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async (index: number) => {
      try {
        const blob = await apiService.get<Blob>(
          `/image/${stompApi.getCode()}/${index}`,
          false
        );
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch {
        console.error("Failed to load the image");
        setImageUrl("/placeholder.png");
      }
    };

    const fetchSummary = async () => {
      try {
        const response = await apiService.get<Summary>(`/game/result/${stompApi.getCode()}`);
        setSummary(response);
        fetchImage(response.highlightedImageIndex);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchSummary();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [apiService]);

  const spyEntry = Object.entries(summary?.roles ?? {}).find(([, role]) => role === "SPY");
  const spyNickname = spyEntry?.[0] ?? "Unknown";

  const innocentNicknames = Object.entries(summary?.roles ?? {})
    .filter(([, role]) => role === "INNOCENT")
    .map(([nickname]) => nickname);


  return (
    <Frame>
      <VerticalFlex>
        <div><div className="summary-title">
          The {summary?.winnerRole ?? "?"}s
        </div>
          <div className="summary-subtitle">have won the game!</div></div>
        <div className="image-container"><img
          src={imageUrl ?? "/placeholder.png"}
          alt="Summary Highlight"
          className="image"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
            e.currentTarget.style.objectFit = "contain";
          }}
        /></div>
        <HorizontalFlex>
          <div>
            <strong>The Spy:</strong>
            <br />
            {spyNickname}
          </div>
          <div>
            <strong>The Innocents:</strong>
            <ul style={{ paddingLeft: "1rem", margin: 0 }}>
              {innocentNicknames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </HorizontalFlex>
      </VerticalFlex>
    </Frame>
  );
};
