"use client";

import { cloneElement, ReactElement, ReactNode } from "react";

interface TooltipProps {
  tip: string;
  children: ReactElement;
}

const voidHtmlTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type WithClassName = { className?: string; children?: ReactNode };

export const Tooltip = ({ tip, children }: TooltipProps) => {
  const child = children as ReactElement<WithClassName>;
  const isVoidTag = typeof child.type === "string" &&
    voidHtmlTags.has(child.type);
  const className = `${child.props.className ?? ""} tooltip-parent`;

  if (isVoidTag) {
    return (
      <span
        className={className}
        style={{ position: "relative", display: "inline-block" }}
      >
        {cloneElement(child)}
        <span className="tooltip-text">{tip}</span>
      </span>
    );
  }

  return cloneElement(child, {
    className,
    children: (
      <>
        {child.props.children}
        <span className="tooltip-text">{tip}</span>
      </>
    ),
  });
};
