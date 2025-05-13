"use client";
import { AppHeader } from "@/components/AppHeader";
import { Frame } from "@/components/frame";
import { useTheme } from "@/context/ThemeContext";
import AuthForm from "@/components/AuthForm";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function createAuthPage({
  title,
  buttonLabel,
  submitEndpoint,
  successRedirect,
  errorMessages,
  footer,
}: {
  title: string;
  buttonLabel: string;
  submitEndpoint: string;
  successRedirect: string;
  errorMessages: { [code: number]: string };
  footer: React.ReactNode;
}) {
  return function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const api = useApi();
    const tokenStorage = useLocalStorage<string | null>("token", null);

    const handleSubmit = async () => {
      setError("");

      if (!username || !password) {
        setError("Please fill in all fields.");
        return;
      }

      try {
        const res = await api.post<{ token: string }>(submitEndpoint, {
          username,
          password,
        });

        tokenStorage.set(res.token);
        localStorage.setItem("username", username)
        router.push(successRedirect);
      } catch (err) {
        if (
          typeof err === "object" &&
          err !== null &&
          "status" in err &&
          typeof (err as { status?: number }).status === "number"
        ) {
          const status = (err as { status: number }).status;
          const message = (err as { message?: string }).message;
          setError(errorMessages[status] || message || `Error ${status}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error.");
        }
      }
    };

    return (
      <div className="page-wrapper">
        <div className="landing-page">
          <AppHeader onToggleTheme={toggleTheme} />
          <Frame>
            <AuthForm
              title={title}
              onSubmit={handleSubmit}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              error={error}
              buttonLabel={buttonLabel}
              footer={footer}
            />
          </Frame>
        </div>
      </div>
    );
  };
}
