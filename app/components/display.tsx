"use client";

interface DisplayProps {
  children: React.ReactNode;
}

export const Display = ({ children }: DisplayProps) => {
  return <div className="display">{children}</div>;
};
