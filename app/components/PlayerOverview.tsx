import { stompApi } from "@/api/stompApi";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { Player } from "@/types/player";
import { useEffect, useState } from "react";
import { FaBan } from "react-icons/fa";
import { Frame } from "./frame";
import { OverflowContainer } from "./overflowContainer";
import { useApi } from "@/hooks/useApi";

export const PlayerOverview = () => {
  const gameApi = useGame();
  const apiService = useApi();
  const [players, setPlayers] = useState<Player[]>([]);

  /**
   * Manually request all players of a game room.
   */
  const requestPlayers = async () => {
    try {
      const response = await apiService.get<Player[]>(
        `/players/${stompApi.getCode()}`,
      );
      setPlayers(response);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  };

  /**
   * Handles receptions of change in players (e.g. joining / leaving).
   */
  const handlePlayers = (players: Player[]) => {
    setPlayers(players);
  };

  /**
   * Manually request players when initializing the room and then rely on STOMP for player updates.
   */
  useEffect(() => {
    requestPlayers();
    gameApi.onPlayers(handlePlayers);
    return () => {
      gameApi.removePlayersHandler(handlePlayers);
    };
  }, [gameApi]);

  const nickname = stompApi.getNickname();
  const selfPlayer = players.find((p) => p.nickname === nickname);
  const otherPlayers = players.filter((p) => p.nickname !== nickname);

  /**
   * Get the action that is displayed besides the profile (none, kick or vote)
   */
  const getAction = (player: Player) => {
    const gamePhase = gameApi.getGamePhase();
    if (gamePhase === GamePhase.LOBBY && nickname !== player.nickname) {
      return (
        <div className="action">
          <FaBan
            className="ban-icon"
            color={player.color}
            onClick={() => gameApi.sendKickPlayer(player.nickname)}
          />
        </div>
      );
    }
  };

  /**
   * Get the player card for each player (either the smaller for other players or the bigger for self)
   */
  const getProfileCard = (player: Player) => {
    const isSelf = nickname === player.nickname;
    const profileClass = isSelf ? "you" : "other";
    return (
      <div className={`profile ${profileClass}`}>
        <div
          className={`icon ${profileClass}`}
          style={{ background: player.color }}
        >
        </div>
        <div
          className={`player ${profileClass}`}
          style={{ color: player.color }}
        >
          <div className="name">{player.nickname}</div>
          <div className="stats">0 Wins</div>
        </div>
      </div>
    );
  };

  return (
    <Frame className="overview">
      {selfPlayer && (
        <div className="profile-card">
          {getProfileCard(selfPlayer)}
          {getAction(selfPlayer)}
        </div>
      )}
      <OverflowContainer>
        {otherPlayers.map((player) => (
          <div key={player.nickname} className="profile-card">
            {getProfileCard(player)}
            {getAction(player)}
          </div>
        ))}
      </OverflowContainer>
    </Frame>
  );
};
