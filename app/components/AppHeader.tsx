"use client";
import { useRouter } from "next/navigation";
import { FaGithub, FaMoon } from "react-icons/fa";
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

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="app-header">
      {showLogin && (
        <button
          onClick={handleLogin}
          className="app-header-button d-flex align-items-center gap-2"
        >
          Login <HiArrowRight size={18} />
        </button>
      )}

      <button onClick={onToggleTheme} className="app-header-button">
        <FaMoon size={18} />
      </button>

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
