"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { InputField } from "@/components/InputField";
import { Frame } from "@/components/frame";
import { Button } from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

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
      console.log("Login error:", err);

      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        typeof (err as any).status === "number"
      ) {
        const status = (err as { status: number }).status;

        if (status === 401) {
          setError("Invalid username or password.");
        } else {
          setError("Login failed.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <AppHeader onToggleTheme={toggleTheme} />
        <Frame>
          <InputField
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <InputField
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <Button onClick={handleLogin} className="mb-2">
            Login
          </Button>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="text-sm text-center mt-1 text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-gray-500 hover:underline cursor-pointer"
            >
              Register
            </Link>
          </div>
        </Frame>
      </div>
    </div>
  );
}
