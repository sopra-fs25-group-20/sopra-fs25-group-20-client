"use client";
interface BoxProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export const Box = ({ children, className = "", style = {} }: BoxProps) => {
    return (
      <div className={`card p-4 shadow-sm ${className}`} style={{ borderRadius: "12px", ...style }}>
        {children}
      </div>
    );
  };
  