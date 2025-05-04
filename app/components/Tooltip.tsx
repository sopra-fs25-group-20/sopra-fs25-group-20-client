"use client";

import { cloneElement, ReactElement } from "react";

interface TooltipProps {
  tip: string;
  children: ReactElement;
}

type WithClassName = { className?: string; children?: React.ReactNode };

export const Tooltip = ({ tip, children }: TooltipProps) => {
  const child = children as ReactElement<WithClassName>;
  return cloneElement(children as ReactElement<WithClassName>, {
    className: `${child.props.className ?? ""} tooltip-parent`,
    children: (
      <>
        {child.props.children}
        <span className="tooltip-text">{tip}</span>
      </>
    ),
  });
};
