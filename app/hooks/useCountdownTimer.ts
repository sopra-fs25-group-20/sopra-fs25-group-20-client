import { useEffect, useRef, useState } from "react";

export const useCountdownTimer = (
  initialTime: number | null
): number | null => {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialTime === null || initialTime <= 0) return;

    const startTime = Date.now();
    const expectedEnd = startTime + initialTime * 1000;
    setTimeLeft(Math.max(0, Math.round((expectedEnd - Date.now()) / 1000)));

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((expectedEnd - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialTime]);

  return timeLeft;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
