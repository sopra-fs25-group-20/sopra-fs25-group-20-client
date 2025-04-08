"use client";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";
import { Box } from "./Box";
import { PrimaryButton } from "./PrimaryButton";
import { FaShareAlt } from "react-icons/fa";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { GameSettings } from "@/types/gameSettings";
import { Dropdown } from "./dropdown";

const regions = ["Europe", "Asia", "Americas", "Africa"];
const gameDurations = [60, 120, 180];
const votingDurations = [15, 30, 45];

export const GameSettingsComponent = () => {
  const ws = useGame();
  const [settings, setSettings] = useState<GameSettings>({
    votingTimer: 15,
    gameTimer: 60,
    imageCount: 9,
    imageRegion: "Europe",
  });

  const handlePhase = (data: GamePhase) => {
    // TO-DO: Redirect to game page when phase changes
    console.warn(`TO-DO: Redirect to ${data}`)
  };

  const handleSettings = (data: GameSettings) => {
    setSettings(data);
  };

  useEffect(() => {
    ws.onPhase(handlePhase);
    ws.onSettings(handleSettings);
  }, [ws]);

  const handleShareGameCode = () => {
    const code = stompApi.getCode();
    navigator.clipboard.writeText(code);
  };

  const updateSettings = (key: keyof GameSettings, value: string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    ws.sendSettings(newSettings);
  };

  return (
    <div>
      <Box className="card-box" style={{ width: "350px" }}>
        <Dropdown
          label="Region Restrictions"
          options={regions}
          value={settings.imageRegion}
          onChange={(value) => updateSettings("imageRegion", value)}
        />
        <Dropdown
          label="Duration Game"
          options={gameDurations}
          value={settings.gameTimer}
          onChange={(value) =>
            updateSettings("gameTimer", parseInt(value as string))}
        />
        <Dropdown
          label="Duration Voting"
          className="margin-inbetween"
          options={votingDurations}
          value={settings.votingTimer}
          onChange={(value) =>
            updateSettings("votingTimer", parseInt(value as string))}
        />
        <div className="button-row">
          <PrimaryButton
            onClick={ws.sendStartGame}
            className="half-button"
          >
            Start the Game
          </PrimaryButton>
          <PrimaryButton
            onClick={handleShareGameCode}
            className=""
          >
            <FaShareAlt size={18} />
          </PrimaryButton>
        </div>
      </Box>
    </div>
  );
};
