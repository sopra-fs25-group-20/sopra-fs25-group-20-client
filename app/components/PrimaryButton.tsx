"use client";
interface PrimaryButtonProps {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
  }
  
  export const PrimaryButton = ({
    label,
    onClick,
    type = "button",
    className = "",
  }: PrimaryButtonProps) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`btn btn-primary fw-bold ${className}`}
        style={{ backgroundColor: "#f23674", border: "none" }}
      >
        {label}
      </button>
    );
  };
  