"use client";

interface VerticalFlexProps {
  children: React.ReactNode;
  gap?: number;
  width?: number;
}

export const VerticalFlex = ({ children, gap = 30, width }: VerticalFlexProps) => (
  <div
    className="vertical-flex"
    style={{
      gap: `${gap}px`,
      ...(width !== undefined
        ? {
            width: `${width}px`,
            flex: "unset",
          }
        : {}),
    }}
  >
    {children}
  </div>
);
