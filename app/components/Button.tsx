"use client";

import { useState } from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  cooldownMs?: number;
  disabled?: boolean;
}

export const Button = ({
  onClick,
  className = "",
  children,
  cooldownMs = 1000,
  disabled = false,
}: ButtonProps) => {
  const [coolingDown, setCoolingDown] = useState(false);

  const handleClick = () => {
    if (disabled || coolingDown) return;

    if (onClick) {
      onClick();
    }

    setCoolingDown(true);
    setTimeout(() => setCoolingDown(false), cooldownMs);
  };

  const isDisabled = disabled || coolingDown;
  return (
    <button
      onClick={handleClick}
      className={`button ${isDisabled ? "disabled" : ""} ${className}`}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
