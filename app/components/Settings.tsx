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
import { useIsRoomAdmin } from "@/hooks/isRoomAdmin";
import { Tooltip } from "./Tooltip";
import { useApi } from "@/hooks/useApi";

const gameDurations = [120, 300, 600];
const votingDurations = [10, 20, 30];

const regionDisplayMap = {
  europe: "Europe",
  asia: "Asia",
  north_america: "North America",
  south_america: "South America",
  africa: "Africa",
} as const;

const regionBackendMap = Object.fromEntries(
  Object.entries(regionDisplayMap).map(([k, v]) => [v, k])
);

export const Settings = () => {
  const gameApi = useGame();
  const apiService = useApi();
  const isRoomAdmin = useIsRoomAdmin();
  const [settings, setSettings] = useState<GameSettings>({
    votingTimer: 30,
    gameTimer: 300,
    imageCount: 9,
    imageRegion: "europe",
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

    /**
     * Request game settings.
     */
    const requestSettings = async () => {
      try {
        const response = await apiService.get<GameSettings>(
          `/settings/${stompApi.getCode()}`
        );
        setSettings(response);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    requestSettings();

    gameApi.onSettings(handleSettings);
    return () => {
      gameApi.removeSettingsHandler(handleSettings);
    };
  }, [apiService, gameApi]);

  return (
    <Frame className="settings">
      <div className="setting">
        <Tooltip tip="Copy the game code using the share button below">
          <label className="half-button">Game Code:</label>
        </Tooltip>
        <Dropdown
          options={[stompApi.getCode()]}
          value={stompApi.getCode()}
          onChange={() => {}}
          disabled={true}
        />
      </div>
      <div className="setting">
        <Tooltip tip="Restrict the images to the chosen region">
          <label className="half-button">Region Restrictions:</label>
        </Tooltip>
        <Dropdown
          options={Object.values(regionDisplayMap)}
          value={
            regionDisplayMap[
              settings.imageRegion as keyof typeof regionDisplayMap
            ]
          }
          onChange={(value) =>
            updateSettings(
              "imageRegion",
              regionBackendMap[value as keyof typeof regionBackendMap]
            )
          }
          disabled={!isRoomAdmin}
        />
      </div>
      <div className="setting">
        <Tooltip tip="Chose the duration of one round">
          <label className="half-button">Duration Game:</label>
        </Tooltip>
        <Dropdown
          options={gameDurations}
          value={settings.gameTimer}
          onChange={(value) =>
            updateSettings("gameTimer", parseInt(value as string))
          }
          disabled={!isRoomAdmin}
        />
      </div>
      <div className="setting">
        <Tooltip tip="Chose the maximum duration allowed to vote out a player">
          <label className="half-button">Duration Voting:</label>
        </Tooltip>
        <Dropdown
          options={votingDurations}
          value={settings.votingTimer}
          onChange={(value) =>
            updateSettings("votingTimer", parseInt(value as string))
          }
          disabled={!isRoomAdmin}
        />
      </div>
      <HorizontalFlex gap={15}>
        {isRoomAdmin ? (
          <>
            <Tooltip tip="A minimum of 3 players is needed!">
              <Button onClick={handleStartGame}>Start the Game</Button>
            </Tooltip>
            <Tooltip tip="Copy the game code to the clipboard">
              <Button onClick={handleShareGameCode} className="hug">
                <FaShareAlt size={18} />
              </Button>
            </Tooltip>
          </>
        ) : (
          <Button onClick={handleShareGameCode}>Share the Game</Button>
        )}
      </HorizontalFlex>
    </Frame>
  );
};
