"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Frame } from "@/components/frame";
import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/gamesetup");
    }
  }, [isLoggedIn, router]);

  const handlePlayAsGuest = () => {
    router.push("/gamesetup");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <AppHeader onToggleTheme={toggleTheme} />
        <Frame>
          <img
            src="SpyQuest_transparent.png"
            alt="Game Logo"
            className="logo-animated"
            style={{ width: "10rem", marginBottom: "0.5rem" }}
          />
          <h1 className="title-animated">Welcome To SpyQuest</h1>
          <Button onClick={handleRegister} className="animated-button">Register</Button>
          <Button onClick={handlePlayAsGuest} className="animated-button">Play as guest</Button>
        </Frame>
      </div>
    </div>
  );
}
