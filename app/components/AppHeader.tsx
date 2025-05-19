"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaGithub, FaMoon, FaUser } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

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
  const { isLoggedIn, logout } = useAuth();

  const isGameCodePage = pathname.startsWith("/game/");

  const handleLogin = () =>
    isGameCodePage ? window.open("/login", "_blank") : router.push("/login");

  const handleProfile = () =>
    isGameCodePage
      ? window.open("/profile", "_blank")
      : router.push("/profile");

  return (
    <header className="app-header">
      {!isLoggedIn && showLogin && (
        <button
          onClick={handleLogin}
          className="app-header-button d-flex align-items-center gap-2"
        >
          Login <HiArrowRight size={18} />
        </button>
      )}
      {isLoggedIn && (
        <>
          <button
            onClick={handleProfile}
            className="app-header-button d-flex align-items-center gap-2"
          >
            <FaUser size={18} />
            <span>Profile</span>
          </button>
          <button
            onClick={logout}
            className="app-header-button d-flex align-items-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </>
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
