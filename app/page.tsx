"use client";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Frame } from "@/components/frame";
import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

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
            src="logo1.png"
            alt="Game Logo"
            className="logo-animated"
            style={{ width: "10rem", marginBottom: "0.5rem" }}
          />
          <div className="title-animated">WELCOME TO SPYQUEST</div>
          <Button onClick={handleRegister} className="animated-button">
            Register
          </Button>
          <Button onClick={handlePlayAsGuest} className="animated-button">
            Play as guest
          </Button>
        </Frame>
      </div>
    </div>
  );
}
