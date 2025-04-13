"use client";

interface HorizontalFlexProps {
  children: React.ReactNode;
  gap?: number;
}

export const HorizontalFlex = ({ children, gap = 30 }: HorizontalFlexProps) => (
  <div className="horizontal-flex" style={{ gap: `${gap}px` }}>
    {children}
  </div>
);
