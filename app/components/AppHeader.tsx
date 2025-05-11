"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname  } from "next/navigation";
import { FaGithub, FaMoon, FaUser } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

interface AppHeaderProps {
  showLogin?: boolean;
  onToggleTheme?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showLogin = true,
  onToggleTheme,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const isGameCodePage = pathname.startsWith("/game/");

  const handleLogin = () =>
    isGameCodePage ? window.open("/login", "_blank") : router.push("/login");

  const handleProfile = () =>
    isGameCodePage ? window.open("/profile", "_blank") : router.push("/profile");

  
  return (
    <header className="app-header">
      {!token && showLogin && (
        <button
          onClick={handleLogin}
          className="app-header-button d-flex align-items-center gap-2"
        >
          Login <HiArrowRight size={18} />
        </button>
      )}
      {token && (
        <button
          onClick={handleProfile}
          className="app-header-button d-flex align-items-center gap-2"
        >
          <FaUser size={18} />
          <span>Profile</span>
        </button>
      )}
      {onToggleTheme && (
        <button onClick={onToggleTheme} className="app-header-button">
          <FaMoon size={18} />
        </button>
      )}
      <a
        href="https://github.com/sopra-fs25-group-20/sopra-fs25-group-20-client"
        target="_blank"
        rel="noopener noreferrer"
        className="app-header-button"
      >
        <FaGithub size={18} />
      </a>
    </header>
  );
};
