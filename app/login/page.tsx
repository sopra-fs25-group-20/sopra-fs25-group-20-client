"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Frame } from "@/components/frame";
import { useTheme } from "@/context/ThemeContext";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const api = useApi();
  const tokenStorage = useLocalStorage<string | null>("token", null);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await api.post<{ token: string }>("/login", {
        username,
        password,
      });

      tokenStorage.set(res.token);
      router.push("/profile");
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        typeof (err as { status?: number }).status === "number"
      ) {
        const status = (err as { status: number }).status;
        const message = (err as { message?: string }).message;

        if (status === 401) {
          setError("Invalid username or password.");
        } else if (status === 400) {
          setError("Invalid input. Please check your form.");
        } else {
          setError(message || `Error ${status}: Login failed.`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected login error.");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <AppHeader onToggleTheme={toggleTheme} />
        <Frame>
          <AuthForm
            title="Login"
            onSubmit={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            buttonLabel="Login"
            footer={
              <>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  Register
                </Link>
              </>
            }
          />
        </Frame>
      </div>
    </div>
  );
}
