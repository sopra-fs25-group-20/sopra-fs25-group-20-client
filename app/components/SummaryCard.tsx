"use client";

import { Frame } from "./frame";

interface SummaryCardProps {
  code: string;
  winningRole: string;
  spyName: string;
  innocentNames: string[];
  error?: string;
  imageIndex: number;
}

export const SummaryCard = ({
  code,
  winningRole,
  spyName,
  innocentNames,
  error,
  imageIndex,
}: SummaryCardProps) => {
  return (
    <Frame className="summary-card">
      {error ? (
        <div className="summary-placeholder">Summary data could not be loaded.</div>
      ) : (
        <>
          <div className="summary-title">The {winningRole}s</div>
          <div className="summary-subtitle">have won the game!</div>
          <img
            src={`/image/${code}/${imageIndex}`}
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
            {spyName}
          </div>
          <div>
            <strong>The Innocents:</strong>
            <ul style={{ paddingLeft: "1rem", margin: 0 }}>
              {innocentNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Frame>
  );
};
