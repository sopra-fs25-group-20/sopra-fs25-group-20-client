"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ErrorBarProps {
  message: string;
  duration?: number;
  onDone?: () => void;
}

export const ErrorBar = (
  { message, duration = 3000, onDone }: ErrorBarProps,
) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onDone?.();
      }, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return createPortal(
    <div
      className={`error-bar ${visible ? "fade-in" : "fade-out"}`}
      role="alert"
    >
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {message}
    </div>,
    document.body,
  );
};
