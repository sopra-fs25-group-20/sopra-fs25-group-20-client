"use client";

interface VerticalFlexProps {
  children: React.ReactNode;
  gap?: number;
}

export const VerticalFlex = ({ children, gap = 30 }: VerticalFlexProps) => (
  <div className="vertical-flex" style={{ gap: `${gap}px` }}>
    {children}
  </div>
);
