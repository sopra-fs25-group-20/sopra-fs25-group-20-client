"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { ErrorBar } from "@/components/ErrorBar";

interface ErrorBarContextValue {
  showError: (message: string, duration?: number) => void;
}

const ErrorBarContext = createContext<ErrorBarContextValue | undefined>(
  undefined,
);

export const useErrorBar = (): ErrorBarContextValue => {
  const context = useContext(ErrorBarContext);
  if (!context) {
    throw new Error("useErrorBar must be used within an ErrorBarProvider");
  }
  return context;
};

export const ErrorBarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(3000);

  const showError = useCallback((msg: string, dur?: number) => {
    setMessage(msg);
    setDuration(dur ?? 3000);
  }, []);

  return (
    <ErrorBarContext.Provider value={{ showError }}>
      {children}
      {message && (
        <ErrorBar
          key={message + duration}
          message={message}
          duration={duration}
          onDone={() => setMessage(null)}
        />
      )}
    </ErrorBarContext.Provider>
  );
};
