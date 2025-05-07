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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const api = useApi();
  const tokenStorage = useLocalStorage<string | null>("token", null);

  const handleRegister = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await api.post<{ token: string }>("/register", {
        username,
        password,
      });

      tokenStorage.set(res.token);
      router.push("/profile");
    } catch (err) {
      console.log("Register error:", err);

      const error = err as { status?: number; message?: string };
      const status = error?.status;

      if (status === 409) {
        setError("Username already exists.");
      } else if (typeof error?.message === "string") {
        setError(error.message);
      } else {
        setError("Registration failed.");
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
          <Button onClick={handleRegister} className="mb-2">
            Register
          </Button>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="text-sm text-center mt-1 text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gray-500 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </div>
        </Frame>
      </div>
    </div>
  );
}
