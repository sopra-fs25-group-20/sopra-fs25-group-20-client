"use client";

interface FrameProps {
  children: React.ReactNode;
  hug?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Frame = (
  { children, hug, className = "", style = {} }: FrameProps,
) => (
  <div className={`frame ${hug ? " hug" : ""} ${className}`} style={style}>
    {children}
  </div>
);
