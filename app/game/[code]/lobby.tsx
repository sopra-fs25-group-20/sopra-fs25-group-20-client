"use client";
import { AppHeader } from "@/components/AppHeader";
import { Chat } from "@/components/chat";
import { Settings } from "@/components/Settings";
import { PlayerOverview } from "@/components/PlayerOverview";
import { useEffect, useState } from "react";
import { VerticalFlex } from "@/components/verticalFlex";

export default function LobbyPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div>
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <div className="lobby">
        <VerticalFlex>
          <Chat />
        </VerticalFlex>
        <VerticalFlex>
          <PlayerOverview />
          <Settings />
        </VerticalFlex>
      </div>
    </div>
  );
}
