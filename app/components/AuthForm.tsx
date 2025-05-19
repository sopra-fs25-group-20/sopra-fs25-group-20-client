"use client";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";

type Props = {
  title: string;
  onSubmit: () => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error?: string;
  footer: React.ReactNode;
  buttonLabel: string;
};

export default function AuthForm({
  title,
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  error,
  footer,
  buttonLabel,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
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
      <Button onClick={onSubmit} className="mb-2">
        {buttonLabel}
      </Button>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <div className="text-sm text-center mt-1 text-gray-500">{footer}</div>
    </>
  );
}
