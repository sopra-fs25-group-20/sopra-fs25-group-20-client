"use client";

interface PrimaryButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: React.ReactNode;
}

export const PrimaryButton = ({
  onClick,
  type = "button",
  className = "",
  children,
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
};
