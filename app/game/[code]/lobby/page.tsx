"use client";
import { AppHeader } from "@/components/AppHeader";
import { ChatWindow } from "@/components/chatWindow";
import { GameSettingsComponent } from "@/components/gameSettingsComponent";
import { PlayerOverview } from "@/components/PlayerOverview";
import { useEffect, useState } from "react";

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div>
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <div className="frame">
        <ChatWindow />
        <div className="right-column">
          <PlayerOverview />
          <GameSettingsComponent />
        </div>
      </div>
    </div>
  );
}
