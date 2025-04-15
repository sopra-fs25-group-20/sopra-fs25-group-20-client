"use client";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";
import { FaShareAlt } from "react-icons/fa";
import { useGame } from "@/hooks/useGame";
import { GameSettings } from "@/types/gameSettings";
import { Dropdown } from "./dropdown";
import { Button } from "./Button";
import { Frame } from "./frame";
import { HorizontalFlex } from "./horizontalFlex";

const regions = ["Europe", "Asia", "Americas", "Africa"];
const gameDurations = [60, 120, 180];
const votingDurations = [15, 30, 45];

export const Settings = () => {
  const gameApi = useGame();
  const [settings, setSettings] = useState<GameSettings>({
    votingTimer: 15,
    gameTimer: 60,
    imageCount: 9,
    imageRegion: "Europe",
  });

  /**
   * Share game code to clipboard.
   */
  const handleShareGameCode = () => {
    const code = stompApi.getCode();
    navigator.clipboard.writeText(code);
  };

  /**
   * Send game start to backend and redirect to play page.
   */
  const handleStartGame = () => {
    gameApi.sendStartGame();
  };

  /**
   * Send updated game settings to backend.
   */
  const updateSettings = (key: keyof GameSettings, value: string | number) => {
    const negameApiettings = { ...settings, [key]: value };
    setSettings(negameApiettings);
    gameApi.sendSettings(negameApiettings);
  };

  /**
   * Register handlers in game api.
   */
  useEffect(() => {
    /**
     * Handles receptions of changed game settings.
     */
    const handleSettings = (data: GameSettings) => {
      setSettings(data);
    };

    gameApi.onSettings(handleSettings);
  }, [gameApi]);

  return (
    <Frame className="settings">
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
        options={votingDurations}
        value={settings.votingTimer}
        onChange={(value) =>
          updateSettings("votingTimer", parseInt(value as string))}
      />
      <HorizontalFlex gap={15}>
        {stompApi.isRoomAdmin()
          ? (
            <>
              <Button onClick={handleStartGame}>Start the Game</Button>
              <Button onClick={handleShareGameCode} className="hug">
                <FaShareAlt size={18} />
              </Button>
            </>
          )
          : <Button onClick={handleShareGameCode}>Share the Game</Button>}
      </HorizontalFlex>
    </Frame>
  );
};
