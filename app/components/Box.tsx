"use client";
interface BoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Box = ({ children, className = "", style = {} }: BoxProps) => (
  <div className={`card-box ${className}`} style={style}>
    {children}
  </div>
);
