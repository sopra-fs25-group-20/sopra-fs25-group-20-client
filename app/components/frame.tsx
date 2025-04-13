"use client";

interface FrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Frame = ({ children, className = "", style = {} }: FrameProps) => (
  <div className={`frame ${className}`} style={style}>
    {children}
  </div>
);
