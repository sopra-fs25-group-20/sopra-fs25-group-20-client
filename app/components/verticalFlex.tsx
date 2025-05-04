"use client";

interface VerticalFlexProps {
  children: React.ReactNode;
  hug?: boolean;
  gap?: number;
  width?: number;
}

export const VerticalFlex = (
  { children, hug, gap = 30, width }: VerticalFlexProps,
) => (
  <div
    className={`vertical-flex${hug ? " hug" : ""}`}
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
