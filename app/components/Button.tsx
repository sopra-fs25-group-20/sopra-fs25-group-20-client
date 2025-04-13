"use client";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const Button = ({ onClick, className = "", children }: ButtonProps) => {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
};
