"use client";

interface OverflowContainerProps {
  children: React.ReactNode;
}

export const OverflowContainer = ({ children }: OverflowContainerProps) => (
  <div className="overflow-container overflow-auto">{children}</div>
);
