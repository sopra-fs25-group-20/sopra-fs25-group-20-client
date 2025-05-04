"use client";

interface DisplayProps {
  children: React.ReactNode;
  className?: string;
}

export const Display = ({ children, className }: DisplayProps) => {
  return <div className={`display ${className}`}>{children}</div>;
};
